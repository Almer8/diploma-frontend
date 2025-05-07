import React, {useEffect, useState} from 'react';
import styles from "../../styles/AdminMain.module.css"
import axios from "../../utils/axiosInstance";

const AdminMain = () => {

    const [totalTickets, setTotalTickets] = useState()
    const [totalReports, setTotalReports] = useState()

    useEffect(() => {
        axios.get("/ticket?page=0&size=1&sortBy=id&sortDirection=desc").then((response) => {
            setTotalTickets(response.data.body.page.totalElements)
        })
        axios.get("/story/report?page=0&size=1&sortBy=id&sortDirection=desc").then((response) => {
            setTotalReports(response.data.page.totalElements)
        })
    }, []);

    return (
        <div className={styles.content}>
            <div className={styles.card}>
                <div className={styles.textfield}>Служба підтримки</div>
                <div className={styles.textfield}>Активних запитів: {totalTickets}</div>
                <div className={styles.button}>Запити</div>
            </div>
            <div className={styles.card}>
                <div className={styles.textfield}>Скарги на історії</div>
                <div className={styles.textfield}>Активних скарг: {totalReports}</div>
                <div className={styles.button}>Скарги</div>
            </div>
        </div>
    );
};

export default AdminMain;
