import React, {useState} from 'react';
import styles from '../../styles/modals/UserSubmitStoryReport.module.css';

const SubmitSupportTicket = ({callback}) => {
    const [data, setData] = useState()

    return (
        <div className={styles.content} onClick={e => e.stopPropagation()}>
            <input className={styles.input} placeholder={"Тема запиту"}
                   onChange={(e) => setData(prev => ({...prev, topic: e.target.value}))}/>
            <textarea className={styles.richinput} placeholder={"Текст запиту"}
                      onChange={(e) => setData(prev => ({...prev, content: e.target.value}))}/>
            <button className={`${styles.submit}`}
                    onClick={() => callback(data)}>Відправити запит
            </button>
        </div>
    );
};

export default SubmitSupportTicket;
