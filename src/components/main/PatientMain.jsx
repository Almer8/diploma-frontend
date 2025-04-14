import React, {useEffect, useState} from 'react';
import styles from '../../styles/main/PatientMain.module.css'
import axios from "../../utils/axiosInstance";
import {getId} from "../../utils/auth";
import Modal from "../Modal";
import UserSetup from "../modals/UserSetup";
import {mapRole} from "../../utils/roleMapper";
import {getFlagImgUrl} from "../../utils/countryFlags";
import {mapCategory} from "../../utils/categoriesMapper";
import {formatDate, formatTime} from "../../utils/timeUtils";
const PatientMain = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSetup, setIsSetup] = useState(false)
    // eslint-disable-next-line no-self-compare
    const [component, setComponent] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState("");
    const [visit, setVisit] = useState(null);

    const setupUser = (data) =>{
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(data)], {
            type: 'application/json'
        });
        formData.append('r', jsonBlob);

        axios.patch("/user/update", formData).then(res=>{
            setIsSetup(true)
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/auth/${getId()}`);
                if (!response.data) {
                    setComponent(<UserSetup callback={setupUser} />);
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
        axios.get(`/user?role=DOCTOR&q=${query}&page=${page}&size=2&sortBy=id&sortDirection=ASC`)
            .then(res => {
                setDoctors(res.data.content);
                setTotalPages(res.data.page.totalPages);
            })
            .catch(err => console.error(err))
    }, [page, query]);

    useEffect(() => {
        axios.get("/visit?status=PLANNED&status=PAYED&page=0&size=1").then(res => {
            if (res.data.length > 0) {
                const visitInfo = res.data[0];
                setVisit(prev => ({ ...prev, visitInfo }));

                axios.get(`/user/${visitInfo.doctorId}`).then(res2 => {
                    setVisit(prev => ({ ...prev, doctor: res2.data }));
                });
            }
        });
    }, []);

    const handleClose = () => {
        if (isSetup) {
            setIsModalOpen(false);
        }
    };

    return (
        <div className={styles.content}>
            {isModalOpen? <Modal component={component} onClose={handleClose} />
            : null}
            <div className={styles.left}>
                <input className={styles.input} onChange={(e) => setQuery(e.target.value)} placeholder={"Пошук лікаря"}>

                </input>

                <div className={styles.searchcontainer}>
                    <div className={styles.doctorcontainer}>
                        {doctors? doctors.map((doctor) => (
                            <div key={doctor.id} className={styles.doctor}>
                                <div className={styles.doctorleft}>
                                    <div className={styles.textfield}>{`${doctor.surname} ${doctor.name} ${doctor.patronymic? doctor.patronymic : ""} `}</div>
                                    <div className={styles.textfield}>{mapRole(doctor.schedule.role)}</div>
                                    <div className={`${styles.textfield} ${styles.scrollable}`}>{doctor.schedule.services.map(s=>s.name).join(", ")}</div>
                                    <div className={styles.button}>Записатись</div>
                                </div>
                                <div className={styles.doctormiddle}>
                                    <img className={styles.flag} src={getFlagImgUrl(doctor.schedule.country)} alt="flag"/>
                                    <div className={`${styles.textfield} ${styles.categories}`}>{doctor.schedule?.categories?.map(c => mapCategory(c)).join(", ")}</div>
                                    <div className={styles.prices}>{`${Math.min(...doctor.schedule.services.map(s=>s.price))}₴ - ${Math.max(...doctor.schedule.services.map(s=>s.price))}₴`}</div>
                                </div>
                                <div className={styles.doctorright}>
                                    <img className={styles.avatar} src={doctor.avatar || "default.png"} alt="useravatar"/>
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

            <div className={styles.right}>
                <div className={styles.visit}>
                    <div className={styles.textarea}>
                        {visit?.doctor && (
                            <>
                                <div>{`${visit.doctor.surname} ${visit.doctor.name} ${visit.doctor.patronymic ? visit.doctor.patronymic: ""}`}</div>
                                <div>{mapRole(visit.doctor.schedule.role)}</div>
                                <div>{formatDate(visit.visitInfo.startTime)}</div>
                                <div>{`${formatTime(visit.visitInfo.startTime)} - ${formatTime(visit.visitInfo.endTime)}`}</div>
                                <div>{visit.visitInfo.service}</div>
                            </>
                        )}
                    </div>
                    <div className={styles.button}>
                        Подивитись деталі
                    </div>
                </div>

                <div className={styles.button}>Написати в підтримку</div>
            </div>

        </div>
    );
};

export default PatientMain;
