import React from 'react';
import styles from '../../styles/headers/AuthorizedHeader.module.css';
import {Link} from "react-router";
const DoctorHeader = () => {
    return (
        <div className={styles.header}>
            <Link to={"/main"}><div className={styles.logo}>Logo</div></Link>
            <div className={styles.button}>Панель адміністратора</div>
            <div className={styles.content}>
                <Link to={"/patients"}><div className={styles.button}>Користувачі</div></Link>
                <Link to={"/settings"}><div className={styles.button}><img src={"/settings.svg"} alt={"settingsicon"}/></div></Link>
            </div>
        </div>
    );
};

export default DoctorHeader;
