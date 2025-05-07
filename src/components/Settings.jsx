import React, {useEffect, useState} from 'react';
import styles from "../styles/Settings.module.css"
import axios from "../utils/axiosInstance";
import {getId} from "../utils/auth";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import {useNavigate} from "react-router";
import {avatarPath} from "../utils/avatarUtils";

const Settings = () => {
    const [profile, setProfile] = useState()
    const formData = new FormData();
    const navigate = useNavigate()

    const uploader = Uploader({
        apiKey: "free" // Get production API keys from Bytescale
    });
    const options = {
        apiKey: "free",
        metadata:{
            mimeTypes:[
                "image/png",
                "image/jpg",
                "image/jpeg",
            ]
        }
    }

    useEffect(() => {
        axios.get(`/user/${getId()}`).then((response) => {
            if(response.data.avatar === null) {
                setProfile(response.data);
                return;
            }
            setProfile({...response.data, avatar: avatarPath(response.data.avatar)});
        })
    },[])

    const uploadPhoto = async (file) => {
        if(file.length === 0) return;
        formData.append("photo", file[0].originalFile.file)
        axios.patch(`/user/update/photo/${getId()}`, formData).then(() =>{
            window.location.reload();
        })
    }
    const deletePhoto = async () => {
        axios.delete(`/user/delete/photo/${getId()}`).then(() => {
            window.location.reload();
        })
    }

    const updateProfile = async () => {
        axios.patch(`/user/update`, profile).then((res) =>{
            setProfile(res.data);
        })
    }
    const deleteProfile = async () => {
        axios.delete(`/auth/delete/${getId()}`).then(() => {
            localStorage.removeItem("token");
            navigate("/");
        })
    }
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return profile && (
        <div className={styles.container}>
                <div className={styles.up}>
                <div className={styles.left}>
                    <div className={styles.field}>
                        <div className={styles.label}>Прізвище:</div>
                        <input className={styles.textfield} defaultValue={profile.surname}
                               onChange={(e)=> setProfile(prev =>({...prev, surname:e.target.value}))}/>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>Ім'я:</div>
                        <input className={styles.textfield} defaultValue={profile.name}
                               onChange={(e)=> setProfile(prev =>({...prev, name:e.target.value}))}/>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>По батькові:</div>
                        <input className={styles.textfield} defaultValue={profile.patronymic}
                               onChange={(e)=> setProfile(prev =>({...prev, patronymic:e.target.value}))}/>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>Пошта:</div>
                        <input className={styles.textfield} defaultValue={profile.email}
                               onChange={(e)=> setProfile(prev =>({...prev, email:e.target.value}))}/>
                    </div>
                    <button className={`${styles.button} ${styles.green}`} onClick={()=> updateProfile()}>Зберегти зміни</button>
                </div>

                <div className={styles.right}>
                    <img src={profile.avatar || "default.png"} className={styles.avatar} alt={"User avatar"}/>
                    <UploadButton uploader={uploader}
                                  options={options}
                                  onComplete={file => uploadPhoto(file)}>
                        {({onClick}) =>
                    <button className={`${styles.button} ${styles.green}`} onClick={onClick}>Завантажити</button>
                        }
                    </UploadButton>
                    <button className={`${styles.button} ${styles.red}`} onClick={() => deletePhoto()}>Видалити</button>
                </div>
            </div>
            <button className={`${styles.button} ${styles.red} ${styles.down}`} onClick={()=>logout()}>Вийти з акаунту</button>
            <button className={`${styles.button} ${styles.red} ${styles.down}`} onClick={()=>deleteProfile()}>Видалити аккаунт</button>
        </div>
    );
};

export default Settings;
