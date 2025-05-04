import React, {useEffect, useState} from 'react';
import styles from "../styles/PatientVisitView.module.css"
import {useNavigate} from "react-router";
import {mapRole} from "../utils/roleMapper";
import {formatDate, formatTime} from "../utils/timeUtils";
import {mapStatus} from "../utils/statusMapper";
import {handlePay} from "../utils/payVisit";
import axios from "../utils/axiosInstance";

const PatientVisitView = ({visit, user}) => {

    const [diagnosis, setDiagnosis] = useState(null)

    const navigate = useNavigate();
    useEffect(() => {
        if (!visit) {
            navigate("/visits");
            return;
        }
        if(visit.diagnosis.length === 0) {
            return;
        }
        const ids = visit.diagnosis
        axios.get(`/diagnosis?${ids.map(id => `ids=${id}`).join('&')}`,).then(response => {
            setDiagnosis(response.data._embedded.diagnosis);
        })
    }, [visit, navigate]);

    const cancelVisit = () =>{
        console.log("Cancel");
        axios.delete(`/visit/${visit.id}`).then(() => {
            navigate("/visits");
        }).catch(error => console.log(error));
    }

    if(!visit && !user) return null

    return (
        <div className={styles.content}>
            <div className={styles.up}>
                <div className={styles.left}>
                    <label htmlFor={"name"}>Лікар</label>
                    <div id={"name"}
                         className={styles.textfield}>{`${user.surname} ${user.name} ${user.patronymic || ""}`}</div>
                    <label htmlFor={"role"}>Спеціальність</label>
                    <div id={"role"} className={styles.textfield}>{mapRole(user.schedule.role)}</div>
                    <label htmlFor={"time"}>Час</label>
                    <div id={"time"}
                         className={styles.textfield}>{`${formatDate(visit.startTime)} ${formatTime(visit.startTime)} - ${formatTime(visit.endTime)}`}</div>
                    <label htmlFor={"service"}>Послуга</label>
                    <div id={"service"}
                         className={styles.textfield}>{visit.service}</div>
                    <label htmlFor={"service"}>Ціна</label>
                    <div id={"service"}
                         className={styles.textfield}>{visit.price}₴</div>
                </div>

            <div className={styles.middle}>
                <div className={styles.textfield}>Статус: {mapStatus(visit.status).toLowerCase()}</div>
                {visit.status === "PLANNED" ?(
                        <button className={styles.paybutton} onClick={()=>handlePay(visit.id)}>
                            <img className={styles.paybuttonlogo} src={"/liqpay.svg"} alt="paybutton" />
                            <div className={styles.paybuttontext}>Сплатити {visit.price}₴</div>
                        </button>
                    )
                    : null}
                {visit.status === "PAYED" ?(
                        <button className={styles.joinbutton}>
                            <img className={styles.joinbuttonbuttonlogo} src={"/video.svg"} alt="joinbutton" />
                            <div className={styles.joinbuttonbuttontext}>Приєднатися</div>
                        </button>
                    )
                    : null}
                {visit.status !== "CANCELED" ? (
                        <button className={styles.cancelbutton} onClick={()=>cancelVisit()}>Відмінити прийом</button>
                    )
                    : null}
            </div>
            <div className={styles.right}>
                <img className={styles.avatar} src={user.avatar || "/default.png"} alt="useravatar"/>
            </div>
        </div>
            <div className={styles.down}>
                <div className={styles.textcontainer}>
                    <div className={styles.texttitle}>Поставлені діагнози:</div>
                    {diagnosis && diagnosis.map(d => (
                        <div className={styles.diagnosis}>
                            <div className={styles.bold}>• {d.icd_10_code}</div>
                            <div>{d.name}</div>
                        </div>
                    ))}
                </div>
                <div className={styles.textcontainer}>
                    <div className={styles.texttitle}>Рекомендації лікаря:</div>
                        <div className={styles.recommendations}>{visit.recommendations}</div>
                </div>
            </div>

        </div>
    );
};

export default PatientVisitView;
