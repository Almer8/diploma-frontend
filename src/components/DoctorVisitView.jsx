import React, { useEffect, useState } from 'react';
import styles from "../styles/DoctorVisitView.module.css";
import { useNavigate } from "react-router";
import { formatDate, formatTime } from "../utils/timeUtils";
import { mapStatus } from "../utils/statusMapper";
import axios from "../utils/axiosInstance";
import Modal from "./Modal";
import AddDiagnosis from "./modals/AddDiagnosis";
import debounce from 'lodash.debounce'
const DoctorVisitView = ({ visit, user }) => {
    const [diagnosis, setDiagnosis] = useState(null);
    const [visitState, setVisitState] = useState(visit);
    const [isModalOpen, setisModalOpen] = useState(false);
    const [component, setComponent] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        if (!visit) {
            navigate("/visits");
            return;
        }
        if (visitState.diagnosis.length === 0) {
            return;
        }
        const ids = visitState.diagnosis;
        axios.get(`/diagnosis?${ids.map(id => `ids=${id}`).join('&')}`).then(response => {
            setDiagnosis(response.data._embedded.diagnosis);
        });
    }, [visitState, navigate, visit]);

    const cancelVisit = () => {
        console.log("Cancel");
        axios.delete(`/visit/${visit.id}`).then(() => {
            navigate("/visits");
        }).catch(error => console.log(error));
    };

    const diagnosisCallback = (data) => {
        const newVisit = {
            id: visitState.id,
            recommendations: visitState.recommendations,
            diagnosis: data.map(d => d.id),
        };
        axios.patch(`/visit`, newVisit).then((res) => {
            setVisitState(res.data);
            setDiagnosis(data);
            setisModalOpen(false);
        }).catch(error => {
            console.error("Error updating visit", error);
        });
    };

    const handleDiagnosisModal = () => {
        setComponent(<AddDiagnosis callback={diagnosisCallback} diagnosis={diagnosis} />);
        setisModalOpen(true);
    };

    const handleRecomendationsChange = debounce((e)=>{
        saveRecomendations(e.target.value);
    }, 2000)

    const saveRecomendations = (data) => {
        const newVisit = {...visitState, recommendations: data};
        axios.patch(`/visit`, newVisit).then((res) => {
            setVisitState(res.data);
        })
    }

    if (!visitState || !user) return null;

    return (
        <div className={styles.content}>
            {isModalOpen ? <Modal component={component} onClose={() => setisModalOpen(false)} /> : null}
            <div className={styles.up}>
                <div className={styles.left}>
                    <label htmlFor={"name"}>Пацієнт</label>
                    <div id={"name"} className={styles.textfield}>{`${user.surname} ${user.name} ${user.patronymic || ""}`}</div>
                    <label htmlFor={"time"}>Час</label>
                    <div id={"time"} className={styles.textfield}>{`${formatDate(visitState.startTime)} ${formatTime(visitState.startTime)} - ${formatTime(visitState.endTime)}`}</div>
                    <label htmlFor={"service"}>Послуга</label>
                    <div id={"service"} className={styles.textfield}>{visitState.service}</div>
                    <label htmlFor={"service"}>Ціна</label>
                    <div id={"service"} className={styles.textfield}>{visitState.price}₴</div>
                </div>

                <div className={styles.middle}>
                    <div className={styles.textfield}>Статус: {mapStatus(visitState.status).toLowerCase()}</div>
                    {visitState.status === "PAYED" ? (
                        <button className={styles.joinbutton}>
                            <img className={styles.joinbuttonbuttonlogo} src={"/video.svg"} alt="joinbutton" />
                            <div className={styles.joinbuttonbuttontext}>Приєднатися</div>
                        </button>
                    ) : null}
                    {visitState.status !== "CANCELED" ? (
                        <button className={styles.cancelbutton} onClick={() => cancelVisit()}>Відмінити прийом</button>
                    ) : null}
                </div>
                <div className={styles.right}>
                    <img className={styles.avatar} src={user.avatar || "/default.png"} alt="useravatar" />
                </div>
            </div>
            <div className={styles.down}>
                <div className={styles.textcontainer}>
                    <div className={styles.title}>
                        <div className={styles.texttitle}>Поставлені діагнози:</div>
                        <button className={styles.add} onClick={() => handleDiagnosisModal()}>+</button>
                    </div>
                    {diagnosis && diagnosis.map(d => (
                        <div className={styles.diagnosis} key={d.id}>
                            <div className={styles.bold}>• {d.icd_10_code}</div>
                            <div>{d.name}</div>
                        </div>
                    ))}
                </div>
                <div className={styles.textcontainer}>
                    <div className={styles.title}>
                        <div className={styles.texttitle}>Рекомендації лікаря:</div>
                    </div>
                    <textarea className={styles.recommendations}
                              defaultValue={visitState.recommendations}
                              onChange={handleRecomendationsChange} />
                </div>
            </div>
        </div>
    );
};

export default DoctorVisitView;
