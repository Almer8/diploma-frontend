import React from 'react';
import styles from '../../styles/headers/PatientHeader.module.css';
import {Link} from "react-router";
const PatientHeader = () => {
    return (
        <div className={styles.header}>
            <Link to={"/main"}><div className={styles.logo}>Logo</div></Link>
            <div className={styles.content}>
                <Link to={"/visits"}><div className={styles.button}>Прийоми</div></Link>
                <Link to={"/survey"}><div className={styles.button}>Тестування</div></Link>
                <Link to={"/stories"}><div className={styles.button}>Поділись історією</div></Link>
                <Link to={"/settings"}><div className={styles.button}><img src={"/settings.svg"} alt={"settingsicon"}/></div></Link>
            </div>
        </div>
    );
};

export default PatientHeader;
