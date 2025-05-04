import React, {useState} from 'react';
import styles from '../../styles/modals/AddDiagnosis.module.css';
import AsyncSelect from 'react-select/async';
import axios from "../../utils/axiosInstance";

const AddDiagnosis = ({callback, diagnosis}) => {
    const [data, setData] = useState(diagnosis? diagnosis: [])



    const loadOptions = (inputValue, callback) => {
        axios.get("/diagnosis/" + inputValue).then((response) => {
            const diagnosis = response.data._embedded.diagnosis;
            const options = diagnosis.map(d => ({value: d.id, label: `${d.icd_10_code} ${d.name}`}));
            const diagnosisIds = data.map(d => d.id)
            callback(options.filter(o => !diagnosisIds.includes(o.value)));
        })
    }
    return (
        <div className={styles.content} onClick={e => e.stopPropagation()}>
            <AsyncSelect className={styles.input}
                         placeholder={"Введіть назву діагнозу"}
                         loadOptions={loadOptions}
                         value={null}
                         onChange={e => setData([...new Set([...data, {id: e.value, name: e.label}])])}
            />
            <div className={styles.diagnosiscontainer}>
                {data? data.map(d =>{
                    return (
                        <div key={d.id} className={styles.diagnosis}>
                            <div>{d.icd_10_code} {d.name}</div>
                            <button onClick={()=> setData(data.filter(i => i.id !== d.id))}>X</button>
                        </div>
                    );
                }): null}

            </div>
            <button className={`${styles.submit}`}
                    onClick={() => callback(data)}>Відправити запит
            </button>
        </div>
    );
};

export default AddDiagnosis;
