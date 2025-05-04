import React, {useState} from 'react';
import styles from '../../styles/modals/DoctorSetup.module.css';
import {Uploader} from "uploader";
import {UploadDropzone} from "react-uploader";

const UserSetup = ({callback}) => {
    const [idFiles, setIdFiles] = useState()
    const [certificates, setCertificates] = useState()
    const uploader = Uploader({
        apiKey: "free"
    });
    const options = {
        multi: true,
    }


    return (
        <div className={styles.content} onClick={e => e.stopPropagation()}>
            <div className={styles.title}>Завантажте документи. Якщо хочете завантажити щось ще, завантажуйте всі документи знову.</div>
            <div className={styles.form}>
                <label htmlFor={"id"}>Документи, що підтверджують особу</label>
                <UploadDropzone className={styles.input}
                                id={"id"}
                                uploader={uploader}
                                options={options}
                                onUpdate={files => setIdFiles(files.map(f => f.originalFile.file))}
                                minWidth={"1200px"}
                                height={"300px"}
                        />
                <label htmlFor={"certificates"}>Документи, що підтверджують кваліфікацію та особливі статуси (дипломи, сертифікати, посвідчення УБД, витяг з рішення ЕКОПФО тощо)</label>
                <UploadDropzone className={styles.input}
                                id={"certificates"}
                                uploader={uploader}
                                options={options}
                                onUpdate={files => setCertificates(files.map(f => f.originalFile.file))}
                                minWidth={"1200px"}
                                height={"300px"}
                />
                <button className={styles.submit} onClick={() => callback(idFiles, certificates)}>Відправити</button>
            </div>
        </div>
    );
};

export default UserSetup;
