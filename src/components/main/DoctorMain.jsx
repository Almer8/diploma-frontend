import React, {useEffect, useState} from 'react';
import styles from '../../styles/main/DoctorMain.module.css';
import axios from "../../utils/axiosInstance";
import {getId} from "../../utils/auth";
import Modal from "../Modal";
import SubmitSupportTicket from "../modals/SubmitSupportTicket";
import DoctorSetup from "../modals/DoctorSetup";
import {formatVisitTime} from "../../utils/timeUtils";

const DoctorMain = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSetup, setIsSetup] = useState(false)
    // eslint-disable-next-line no-self-compare
    const [component, setComponent] = useState(null);
    const [visits, setVisits] = useState(null);
    const [patientsMap, setPatientsMap] = useState(null)

    const sendDocuments = (idFiles, certificates) =>{
        const formData = new FormData();
        console.log(idFiles, certificates);
        idFiles.forEach(file => formData.append("id", file));
        certificates.forEach(file => formData.append("certificates", file));

        axios.post("/documents", formData).then(()=>{
            alert("Документи відправлено!")
        })
    }

    const sendReport = (data) =>{
        axios.post("/ticket", data).then(()=>{
            setIsModalOpen(false)
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/auth/${getId()}`);
                if (!response.data) {
                    setComponent(<DoctorSetup callback={sendDocuments} />);
                    setIsModalOpen(true);
                } else {
                    setIsSetup(true)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        if (isSetup) {
            setIsModalOpen(false);
        }
    }, [isSetup]);

    useEffect(() => {
        axios.get(`/visit?status=PLANNED&status=PAYED&page=0&size=4`)
            .then(async res => {
                const newVisits = res?.data?.content || [];
                setVisits(newVisits);

                const patientsIdsToFetch = [...new Set (res?.data?.content
                    .map(v => v.patientId))];

                const newPatients = {};
                await Promise.all(patientsIdsToFetch.map(async (id) => {
                    try {
                        const res = await axios.get(`/user/${id}`);
                        newPatients[id] = res.data;
                    } catch (err) {
                        console.error(`Failed to load patient with ID ${id}`, err);
                    }
                }));

                setPatientsMap(prev => ({...prev, ...newPatients}));
            })
            .catch(err => console.error(err));

    }, []);

    const handleClose = () => {
        if (isSetup) {
            setIsModalOpen(false);
        }
    };
    const handleReportModal = () => {
        setComponent(<SubmitSupportTicket callback={sendReport} />)
        setIsModalOpen(true);
    }

    return (
        <div className={styles.content}>
            {isModalOpen? <Modal component={component} onClose={handleClose} />
            : null}
            <div className={styles.up}>
                        {visits && patientsMap? visits.map((visit) => {
                                const patient = patientsMap[visit.patientId];
                                return (
                                    <div key={visit.id} className={styles.visit}>
                                        <div
                                            className={styles.textfield}>{`${patient.surname} ${patient.name} ${patient.patronymic ? patient.patronymic : ""} `}
                                        </div>
                                        <div className={styles.textfield}>{visit.service}</div>
                                        <div className={styles.textfield}>{formatVisitTime(visit.startTime, visit.endTime)}</div>
                                        <div className={styles.button}>Деталі прийому</div>

                                    </div>
                                );
                        }) : null}
            </div>

            <div className={styles.down}>

                <div className={styles.button} onClick={() => handleReportModal()}>Написати в підтримку</div>
            </div>

        </div>
    );
};

export default DoctorMain;
