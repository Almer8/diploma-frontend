import React from 'react';
import styles from '../../styles/modals/VisitCreate.module.css'
import {formatVisitTime} from "../../utils/timeUtils";

const VisitCreate = ({data, metadata, callback}) => {

    return (
        <div className={styles.content} onClick={e => e.stopPropagation()}>
            <div className={styles.form}>
                <label htmlFor={"doctor"}>Лікар</label>
                <div className={styles.textfield}
                     id={"doctor"}>{`${metadata.doctor.surname} ${metadata.doctor.name} ${metadata.doctor.patronymic ? metadata.doctor.patronymic : ""}`}</div>
                <label htmlFor={"patient"}>Пацієнт</label>
                <div className={styles.textfield}
                     id={"patient"}>{`${metadata.patient.surname} ${metadata.patient.name} ${metadata.patient.patronymic ? metadata.patient.patronymic : ""}`}</div>
                <label htmlFor={"service"}>Послуга</label>
                <div className={styles.textfield}
                     id={"service"}>{data.service}</div>
                <label htmlFor={"date"}>Час</label>
                <div className={styles.textfield}
                     id={"date"}>{formatVisitTime(data.startTime,data.endTime)}</div>


                <button className={styles.submit} onClick={() => callback(data)}>Підтвердити запис</button>
            </div>
        </div>
    );
};

export default VisitCreate;
