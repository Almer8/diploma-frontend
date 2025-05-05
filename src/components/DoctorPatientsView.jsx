import React, {useEffect, useState} from 'react';
import styles from "../styles/DoctorPatientsView.module.css";
import axios from "../utils/axiosInstance";
import {formatDate} from "../utils/timeUtils";
import {Link} from "react-router";
import {avatarPath} from "../utils/avatarUtils";

const DoctorPatientsView = () => {
    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState("");


    useEffect(() => {
        axios.get(`/user?role=PATIENT&q=${query}&page=${page}&size=2&sortBy=id&sortDirection=ASC`)
            .then(res => {
                const patients = res.data.content.map(p => ({...p, avatar: avatarPath(p.avatar)}));
                setPatients(patients);

                setTotalPages(res.data.page.totalPages);
            })
            .catch(err => console.error(err))
    }, [page, query]);


    return (
        <div className={styles.content}>
                <input className={styles.input} onChange={(e) => setQuery(e.target.value)} placeholder={"Пошук пацієнта"}/>

                <div className={styles.searchcontainer}>
                    <div className={styles.patientcontainer}>
                        {patients? patients.map((patient) => (
                                <div key={patient.id} className={styles.patient}>
                                    <div className={styles.patientleft}>
                                        <div className={styles.field}>
                                            <div className={styles.textfield}>{`${patient.surname} ${patient.name} ${patient.patronymic ? patient.patronymic : ""} `}</div>
                                        </div>
                                        <div className={styles.field}>
                                            <div className={styles.text}>Дата народження:</div>
                                            <div className={styles.textfield}>{formatDate(patient.birthday)}</div>
                                        </div>
                                        <div className={styles.field}>
                                            <div className={styles.text}>Стать:</div>
                                            <div className={styles.textfield}>{patient.sex ? "Жіноча" : "Чоловіча"}</div>
                                        </div>
                                    </div>
                                    <div className={styles.patientright}>
                                        <img className={styles.avatar} src={patient.avatar || "default.png"}
                                             alt="useravatar"/>
                                        <Link to={`/patient/${patient.id}`} className={styles.down}>
                                        <div className={styles.button}>Деталі</div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                            : null}
                    </div>
                    <div className={styles.paginationbuttons}>
                        <button className={styles.button}
                                onClick={() => setPage(prev => prev -1)}
                                disabled={page === 0}>{"<-"}</button>
                        <button className={styles.button}
                                onClick={() => setPage(prev => prev + 1)}
                                disabled={page === totalPages-1}>{"->"}</button>
                    </div>
                </div>

            </div>
        );
};

export default DoctorPatientsView;
