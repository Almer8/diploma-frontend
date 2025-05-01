import React, {useState} from 'react';
import styles from '../../styles/modals/UserSubmitStoryReport.module.css';

const UserSubmitStoryReport = ({callback, storyId}) => {
    const [data, setData] = useState({
        story_id: storyId
    })

    return (
        <div className={styles.content} onClick={e => e.stopPropagation()}>
            <input className={styles.input} placeholder={"Тема скарги"}
                   onChange={(e) => setData(prev => ({...prev, topic: e.target.value}))}/>
            <textarea className={styles.richinput} placeholder={"Текст скарги"}
                      onChange={(e) => setData(prev => ({...prev, content: e.target.value}))}/>
            <button className={`${styles.submit}`}
                    onClick={() => callback(data)}>Надіслати історію
            </button>
        </div>
    );
};

export default UserSubmitStoryReport;
