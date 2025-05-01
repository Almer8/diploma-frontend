import React, {useEffect, useState} from 'react';
import styles from "../../styles/modals/AnonStoryCreate.module.css"
import axios from "../../utils/axiosInstance";
import CreatableSelect from "react-select/creatable";

const AnonStoryCreate = ({callback}) => {

    const [anonStory, setAnonStory] = useState()
    const [consent, setConsent] = useState()
    const [tagOptions, setTagOptions] = useState()
    useEffect(() => {
        axios.get("/story/tags").then((res) => {
            const formattedTags = res.data._embedded.tags.map(t => ({
                value: t.id,
                label: t.name,
            }));
            setTagOptions(formattedTags)
        })
    }, []);

    return (
        <div className={styles.content} onClick={e => e.stopPropagation()}>
            <input className={styles.input} placeholder={"Назва історії"}
                   onChange={(e) => setAnonStory(prev => ({...prev, title: e.target.value}))}/>
            <input className={styles.input} placeholder={"Ім'я відправника"}
                   onChange={(e) => setAnonStory(prev => ({...prev, displayed_name: e.target.value}))}/>
            <CreatableSelect
                className={styles.select}
                placeholder={"Теги"}
                isMulti
                options={tagOptions}
                onChange={(e) => setAnonStory(prev => ({...prev, tags: e}))}
                creatable/>


            <textarea className={styles.richinput} placeholder={"Текст історії"}
                      onChange={(e) => setAnonStory(prev => ({...prev, content: e.target.value}))}/>
            <div className={styles.agreement}>
                <input className={styles.checkbox} type={"checkbox"} onChange={(e) => setConsent(e.target.checked)}/>
                <div className={styles.text}>Згода на публікацію</div>
            </div>
            <button className={`${styles.submit} ${!consent? styles.disabled : ''}`}
                    disabled={!consent}
                    onClick={()=>callback(anonStory)}>Надіслати історію</button>
        </div>
    );
};

export default AnonStoryCreate;
