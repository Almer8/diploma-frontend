import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CallPage = () => {
    const { id } = useParams(); // visitId
    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socketRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const bufferedOfferRef = useRef(null);
    const remoteStreamRef = useRef(new MediaStream());

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!id || !token) return;

        const ws = new WebSocket(`ws://localhost:8080/ws/visit/${id}?token=${token}`);
        socketRef.current = ws;

        ws.onopen = () => console.log("WebSocket connected");
        ws.onmessage = async (event) => {
            const msg = JSON.parse(event.data);
            console.log("WS Message:", msg);
            await handleSignal(msg);
        };
        ws.onerror = err => console.error("WebSocket error:", err);
        ws.onclose = () => console.log("WebSocket closed");

        return () => ws.close();
    }, [id]);

    const createPeerConnection = () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        pc.onicecandidate = event => {
            if (event.candidate) {
                socketRef.current?.send(JSON.stringify({
                    type: "candidate",
                    payload: event.candidate
                }));
            }
        };

        pc.ontrack = event => {
            remoteStreamRef.current.addTrack(event.track);

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStreamRef.current;
                remoteVideoRef.current.onloadedmetadata = () => {
                    remoteVideoRef.current.play().catch(err => {
                        console.warn("Play error:", err);
                    });
                };
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    };

    const startLocalStream = async (pc) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        });
    };

    const startCall = async () => {
        const pc = peerConnectionRef.current;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.send(JSON.stringify({ type: "offer", payload: offer }));
    };

    const handleSignal = async (message) => {
        switch (message.type) {
            case "joined": {
                const pc = createPeerConnection();
                await startLocalStream(pc);

                if (message.payload.initiator) {
                    await startCall();
                } else if (bufferedOfferRef.current) {
                    await handleSignal({ type: "offer", payload: bufferedOfferRef.current });
                    bufferedOfferRef.current = null;
                }
                break;
            }
            case "offer": {
                if (!peerConnectionRef.current || peerConnectionRef.current.signalingState !== "stable") {
                    console.warn("PeerConnection not ready");
                    bufferedOfferRef.current = message.payload;
                    return;
                }
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.payload));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socketRef.current?.send(JSON.stringify({ type: "answer", payload: answer }));
                break;
            }
            case "answer": {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.payload));
                break;
            }
            case "candidate": {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.payload));

                } catch (err) {
                    console.warn("Error adding ICE candidate:", err);
                }
                break;
            }
            default:
                break;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-4">
            <div className="flex gap-4">
                <video ref={localVideoRef} autoPlay playsInline muted className="rounded-xl shadow-lg w-[400px] h-[300px]" />
                <video ref={remoteVideoRef} autoPlay playsInline className="rounded-xl shadow-lg w-[400px] h-[300px]" />
            </div>
            <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
                onClick={() => navigate('/')}
            >
                Завершити виклик
            </button>
        </div>
    );
};

export default CallPage;
