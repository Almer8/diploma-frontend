import React, {useEffect, useState} from 'react';
import styles from '../../styles/modals/UserSetup.module.css';
import {getId} from "../../utils/auth";

const UserSetup = ({callback}) => {
    const [data, setData] = useState({
        id: getId()
    })
    const [maxDate, setMaxDate] = useState()
    useEffect(() => {
        const today = new Date();

        const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));

        const maxDate = eighteenYearsAgo.toISOString().split('T')[0];
        setMaxDate(maxDate)
    }, []);
    return (
        <div className={styles.content} onClick={e => e.stopPropagation()}>
            <div className={styles.title}>Привіт! Познайомимось?</div>
            <div className={styles.form}>
                <label htmlFor={"name"}>Ім'я</label>
                <input className={styles.input}
                       id={"name"}
                       onChange={(e) => setData({...data, name: e.target.value})} />
                <label htmlFor={"name"}>По батькові (опціонально)</label>
                <input className={styles.input}
                       id={"patronymic"}
                       onChange={(e) => setData({...data, patronymic: e.target.value})} />
                <label htmlFor={"surname"}>Прізвище</label>
                <input className={styles.input}
                       id={"surname"}
                       onChange={(e) => setData({...data, surname: e.target.value})} />
                <label htmlFor={"sex"}>Стать</label>
                <select className={styles.input}
                        id={"sex"}
                        onChange={(e) => setData({...data, sex: e.target.value})}>
                    <option value={""}>Оберіть...</option>
                    <option value={false}>Чоловіча</option>
                    <option value={true}>Жіноча</option>
                </select>
                <label htmlFor={"birthday"}>Дата народження</label>
                <input className={styles.input} id={"birthday"}
                       defaultValue={maxDate}
                       max={maxDate}
                       type={"date"}
                       onChange={(e) => setData({...data, birthday: e.target.value})}/>
                <button className={styles.submit} onClick={() => callback(data)}>Відправити</button>
            </div>
        </div>
    );
};

export default UserSetup;
