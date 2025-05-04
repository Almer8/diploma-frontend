import React, {useEffect, useState} from 'react';
import styles from "../styles/DoctorVisitsView.module.css";
import axios from "../utils/axiosInstance";
import {formatVisitTime} from "../utils/timeUtils";
import {mapStatus} from "../utils/statusMapper";
import {Link} from "react-router";
import {avatarPath} from "../utils/avatarUtils";

const DoctorVisitsView = () => {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [visits, setVisits] = useState([]);
    const [patientsMap, setPatientsMap] = useState({});

    useEffect(() => {
        axios.get(`/visit?page=${page}&size=2&sortBy=startTime&sortDirection=desc`)
            .then(async res => {
                const newVisits = res?.data?.content || [];
                setVisits(newVisits);
                setTotalPages(res?.data?.page?.totalPages || 1);

                const patientsIdsToFetch = newVisits
                    .map(v => v.patientId)
                    .filter(id => !patientsMap[id]);

                const newPatients = {};
                await Promise.all(patientsIdsToFetch.map(async (id) => {
                    try {
                        const res = await axios.get(`/user/${id}`);
                        if(res.data.avatar !== null){
                            newPatients[id] = {...res.data, avatar: avatarPath(res.data.avatar)};
                        }
                        else {
                            newPatients[id] = res.data;
                        }
                    } catch (err) {
                        console.error(`Failed to load doctor with ID ${id}`, err);
                    }
                }));

                setPatientsMap(prev => ({...prev, ...newPatients}));
            })
            .catch(err => console.error(err));

    }, [page]);

    return (
        <div className={styles.content}>
            {visits.map((visit) => {
                const patient = patientsMap[visit.patientId];
                return (
                    <div key={visit.id} className={styles.visitCard}>
                        <div className={styles.up}>
                            <div className={styles.left}>
                                {patient ? (
                                    <div
                                        className={styles.textfield}>{`${patient.surname} ${patient.name} ${patient.patronymic || ""}`}</div>
                                ) : null}
                                <div
                                    className={styles.textfield}>{`${visit.service}`}</div>
                                <div
                                    className={styles.textfield}>{`${formatVisitTime(visit.startTime, visit.endTime)}`}</div>
                                <div
                                    className={`${styles.textfield}`}>Статус: {mapStatus(visit.status).toLowerCase()}</div>
                                <Link to={"/visit/view"} state={{visit: visit,patient: patient}}><div className={styles.details}>Подивитись деталі</div></Link>
                            </div>
                        </div>
                        <div className={styles.right}>
                            {patient && (
                                <img src={patient.avatar || "default.png"} alt="avatar" />
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

export default DoctorVisitsView;
