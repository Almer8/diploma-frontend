import React from 'react';
import styles from '../../styles/headers/PatientHeader.module.css';

const PatientHeader = () => {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>Logo</div>
            <div className={styles.content}>
                <div className={styles.button}>Прийоми</div>
                <div className={styles.button}>Тестування</div>
                <div className={styles.button}>Поділись історією</div>
                <div className={styles.button}><img src={"settings.svg"} alt={"settingsicon"}/> </div>
            </div>
        </div>
    );
};

export default PatientHeader;
