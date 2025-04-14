import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router";
import axios from "../utils/axiosInstance";
import styles from "../styles/DoctorView.module.css"
import {mapRole} from "../utils/roleMapper";
import {mapCategory} from "../utils/categoriesMapper";
import {generateScheduleForFiveDays} from "../utils/schedule";
import {getId} from "../utils/auth";
import Modal from "./Modal";
import VisitCreate from "./modals/VisitCreate";
const DoctorView = () => {

    const {id} = useParams();
    const [doctor, setDoctor] = useState(null)
    const [metadata, setMetadata] = useState(null)
    const navigate = useNavigate();
    const [finalSchedule, setFinalSchedule] = useState(null)
    const [isModalOpen, setisModalOpen] = useState(false)
    const [component, setComponent] = useState(null)
    const [data, setData] = useState(
        {
            doctorId: parseInt(id),
            patientId: getId(),
        })


    useEffect(() => {
        axios.get(`/user/${id}`).then((response) => {
            setDoctor(response.data);
            setMetadata(prev =>({...prev, doctor: response.data}));
            setFinalSchedule(generateScheduleForFiveDays(response.data.schedule.schedule, response.data.schedule.template));
            if(!response.data.schedule){
                navigate("/main");
            }
        })
        axios.get(`/user/${getId()}`).then((response) => {
                setMetadata(prev =>({...prev, patient: response.data}));
        })
    },[])

    useEffect(() => {
        if (data.startTime && data.service && metadata?.doctor && metadata?.patient) {
            setComponent(<VisitCreate data={data} metadata={metadata} callback={createVisit} />);
            setisModalOpen(true);
        }
    }, [data, metadata]);

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

    const createVisit = (data) => {
            axios.post("/visit", data).then((response) => {
            setisModalOpen(false);
        })
    }

    return (doctor ? (
        <div className={styles.content}>
            {isModalOpen ? <Modal component={component} onClose={()=>setisModalOpen(false)}/>: null}
            <div className={styles.doctorinfo}>
                <div className={styles.metadata}>
                    <div
                        className={styles.textfield}>{`${doctor.surname} ${doctor.name} ${doctor.patronymic ? doctor.patronymic : ""}`}</div>
                    <div className={styles.textfield}>{mapRole(doctor.schedule.role)}</div>
                    <div className={styles.text}>Країна перебування</div>
                    <div className={styles.textfield}>{doctor.schedule.country}</div>
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
                <div className={styles.categories}>
                    <div className={styles.text}>Категорії лікаря</div>
                    <div
                        className={styles.textfield}>{doctor.schedule.categories.map(c => mapCategory(c)).join(", ")}</div>
                </div>
                <img className={styles.avatar} src={doctor.avatar || "/default.png"} alt="useravatar"/>
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
            ): null);
};

export default DoctorView;
