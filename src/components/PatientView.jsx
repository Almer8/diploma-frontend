import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import axios from "../utils/axiosInstance";
import styles from "../styles/PatientView.module.css"
import {getId} from "../utils/auth";
import Modal from "./Modal";
import VisitCreate from "./modals/VisitCreate";
import {generateScheduleForFiveDays} from "../utils/schedule";
import {avatarPath} from "../utils/avatarUtils";
import {formatDate} from "../utils/timeUtils";
const PatientView = () => {

    const {id} = useParams();
    const [patient, setPatient] = useState(null)
    const [doctor, setDoctor] = useState(null)
    const [metadata, setMetadata] = useState(null)
    const [isModalOpen, setisModalOpen] = useState(false)
    const [finalSchedule, setFinalSchedule] = useState(null)
    const [component, setComponent] = useState(null)
    const [data, setData] = useState(
        {
            doctorId: getId(),
            patientId: parseInt(id),
        })


    useEffect(() => {
        axios.get(`/user/${id}`).then((response) => {
            const patient = {...response.data, avatar: avatarPath(response.data.avatar)}
            setPatient(patient);
            setMetadata(prev =>({...prev, patient: patient}));
        })
        axios.get(`/user/${getId()}`).then((response) => {
            setDoctor(response.data);
            setFinalSchedule(generateScheduleForFiveDays(response.data.schedule.schedule, response.data.schedule.template));
            setMetadata(prev =>({...prev, doctor: response.data}));
        })
    },[])

    useEffect(() => {
        if (data.startTime && data.service && metadata?.doctor && metadata?.patient) {
            setComponent(<VisitCreate data={data} metadata={metadata} callback={createVisit} />);
            setisModalOpen(true);
        }
    }, [data, metadata]);
    const createVisit = (data) => {
            axios.post("/visit", data).then(() => {
            setisModalOpen(false);
        })
    }
    const handleSlotClick = (slot, date) => {
        if (slot.taken) return;

        const [day, month, year] = date.split('.');
        const fullStart = new Date(`${year}-${month}-${day}T${slot.start}`);
        const fullEnd = new Date(`${year}-${month}-${day}T${slot.end}`);

        setData(prev => ({
            ...prev,
            startTime: fullStart.getTime(),
            endTime: fullEnd.getTime(),
        }));
    };

    return (patient && doctor ? (
        <div className={styles.content}>
            {isModalOpen ? <Modal component={component} onClose={() => setisModalOpen(false)}/> : null}
            <div className={styles.doctorinfo}>
                <div className={styles.metadata}>
                    <div className={styles.field}>
                        <div className={styles.label}>Ім'я:</div>
                        <div
                            className={styles.textfield}>{`${patient.surname} ${patient.name} ${patient.patronymic ? patient.patronymic : ""}`}</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>Стать:</div>
                        <div className={styles.textfield}>{patient.sex ? "Жіноча" : "Чоловіча"}</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>Дата народження:</div>
                        <div className={styles.textfield}>{formatDate(patient.birthday)}</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>Пошта:</div>
                        <div className={styles.textfield}>{patient.email}</div>
                    </div>
                    <select
                        className={styles.button}
                        onChange={e => {
                            const selectedService = JSON.parse(e.target.value);
                            setData(prev => ({
                                ...prev,
                                service: selectedService.name,
                                price: selectedService.price
                            }));
                        }}
                    >
                        <option value={""} hidden>Оберіть послугу</option>
                        {doctor.schedule.services.map((s, i) => (
                            <option key={i} value={JSON.stringify(s)}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <img className={styles.avatar} src={patient.avatar || "/default.png"} alt="useravatar"/>
            </div>
            <div className={styles.doctorschedule}>
                {finalSchedule &&
                    finalSchedule.map((day, idx) => (
                        <div key={idx} className={styles.daycolumn}>
                            <div className={styles.dayheader}>{day.date}</div>
                            {day.slots === null ? (
                                <div className={styles.dayoff}>Не працює</div>
                            ) : (
                                <div className={styles.slots}>
                                    {day.slots.map((slot, i) => {
                                        const [d, m, y] = day.date.split(".");
                                        const endTimestamp = new Date(`${y}-${m}-${d}T${slot.end}`).getTime();
                                        const isPast = endTimestamp < Date.now();

                                        return (
                                            <div
                                                key={i}
                                                className={`${styles.slot} ${(slot.taken || isPast) ? styles.taken : ''}`}
                                                onClick={() => handleSlotClick(slot, day.date)}
                                            >
                                                {slot.start} - {slot.end}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    ) : null);
};

export default PatientView;
