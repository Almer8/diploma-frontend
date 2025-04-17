import React, {useEffect, useState} from 'react';
import styles from "../styles/PatientVisitsView.module.css";
import axios from "../utils/axiosInstance";
import {formatDate, formatTime} from "../utils/timeUtils";
import {mapRole} from "../utils/roleMapper";
import {mapStatus} from "../utils/statusMapper";
import {Link} from "react-router";
import {handlePay} from "../utils/payVisit";

const PatientVisitsView = () => {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [visits, setVisits] = useState([]);
    const [doctorsMap, setDoctorsMap] = useState({});

    useEffect(() => {
        axios.get(`/visit?page=${page}&size=3`)
            .then(async res => {
                const newVisits = res?.data?.content || [];
                setVisits(newVisits);
                setTotalPages(res?.data?.page?.totalPages || 1);

                const doctorIdsToFetch = newVisits
                    .map(v => v.doctorId)
                    .filter(id => !doctorsMap[id]);

                const newDoctors = {};
                await Promise.all(doctorIdsToFetch.map(async (id) => {
                    try {
                        const res = await axios.get(`/user/${id}`);
                        newDoctors[id] = res.data;
                    } catch (err) {
                        console.error(`Failed to load doctor with ID ${id}`, err);
                    }
                }));

                setDoctorsMap(prev => ({...prev, ...newDoctors}));
            })
            .catch(err => console.error(err));

    }, [page]);

    return (
        <div className={styles.content}>
            {visits.map((visit) => {
                const doctor = doctorsMap[visit.doctorId];
                return (
                    <div key={visit.id} className={styles.visitCard}>
                        <div className={styles.left}>
                        {doctor ? (
                            <>
                                <div
                                    className={styles.textfield}>{`${doctor.surname} ${doctor.name} ${doctor.patronymic || ""}`}</div>
                                <div className={styles.textfield}>{mapRole(doctor.schedule.role)}</div>
                            </>
                        ) : null}
                        <div
                            className={styles.textfield}>{`${formatDate(visit.startTime)} ${formatTime(visit.startTime)} - ${formatTime(visit.endTime)}`}</div>
                        </div>
                        <div className={styles.middle}>
                            <div className={`${styles.textfield} ${styles.status}`}>Статус: {mapStatus(visit.status).toLowerCase()}</div>
                            <div className={styles.buttons}>
                                {visit.status === "PLANNED" ?(
                                        <button className={styles.paybutton} onClick={()=>handlePay(visit.id)}>
                                            <img className={styles.paybuttonlogo} src={"/liqpay.svg"} alt="paybutton" />
                                            <div className={styles.paybuttontext}>Сплатити {visit.price}₴</div>
                                        </button>
                                    )
                                    : null}
                                <Link to={"/visit/view"} state={{visit: visit,doctor: doctor}}><div className={styles.details}>Подивитись деталі</div></Link>
                            </div>
                        </div>
                        <div className={styles.right}>
                            {doctor && (
                                <img src={doctor.avatar || "default.png"} alt="avatar" />
                            )}
                        </div>
                    </div>
                );
            })}
            <div className={styles.paginationbuttons}>
                <button className={styles.button}
                        onClick={() => setPage(prev => prev - 1)}
                        disabled={page === 0}>{"<-"}</button>
                <button className={styles.button}
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={page === totalPages - 1}>{"->"}</button>
            </div>
        </div>
    );
};

export default PatientVisitsView;
