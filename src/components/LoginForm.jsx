import React, {useState} from 'react';
import styles from '../styles/LoginForm.module.css'
import axios from 'axios';
import {useNavigate} from "react-router";


const LoginForm = () => {

    const [isDoctor, setIsDoctor] = useState(false)
    const [register, setRegister] = useState(false)
    const [data, setData] = useState({})
    const navigate = useNavigate();

    const registerRequest = data => {
        const API_URL = process.env.REACT_APP_API_URL;
        let role;
        if(isDoctor) {
            role = "DOCTOR"
        } else {
            role = "PATIENT"
        }
        axios.post(`${API_URL}/auth/register`, {...data, role: role}).then(res =>{
           localStorage.setItem('token', res.data.token)
           navigate('/main')
        }).catch(err =>{
            console.log(err)
        })
    }

    const loginRequest = data => {
        const API_URL = process.env.REACT_APP_API_URL;
        axios.post(`${API_URL}/auth/login`, data).then(res =>{
            localStorage.setItem('token', res.data.token)
            navigate('/main')
        }).catch(err =>{
            console.log(err)
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.choice}>
                <div className={`${!isDoctor ? styles.green : ''} ${styles.leftchoice}`} onClick={()=>setIsDoctor(false)}>Пацієнт</div>
                <div className={`${isDoctor ? styles.green : ''} ${styles.rightchoice}`} onClick={()=>setIsDoctor(true)}>Лікар</div>
            </div>
            {register ? (
                <div className={styles.form}>
                    <div className={styles.title}>Реєстрація</div>
                    <div className={styles.textbutton} onClick={() => setRegister(false)}>Увійти?</div>
                    <input className={styles.input}
                           placeholder="Пошта"
                           onChange={(e)=>setData({...data, email:e.target.value})}/>
                    <input className={styles.input}
                           placeholder="Пароль"
                           type={"password"}
                           onChange={(e)=>setData({...data, password:e.target.value})}/>
                    <input className={styles.input}
                           placeholder="Повторіть пароль"
                           type={"password"}
                           onChange={(e)=>setData({...data, confirmPassword:e.target.value})}/>
                    <button className={styles.submit} onClick={()=>registerRequest(data)}>Зареєструватись</button>
                </div>
            ) : (
                <div className={styles.form}>
                <div className={styles.title}>Вхід</div>
                    <div className={styles.textbutton} onClick={() => setRegister(true)}>Зареєструватись?</div>
                    <input className={styles.input}
                           placeholder="Пошта"
                           type={"email"}
                           onChange={(e)=>setData({...data, email:e.target.value})}/>
                    <input className={styles.input}
                           placeholder="Пароль"
                           type={"password"}
                           onChange={(e)=>setData({...data, password:e.target.value})}/>
                    <button className={styles.submit} onClick={()=>loginRequest(data)}>Увійти</button>
                </div>
            )}

        </div>
    );
};

export default LoginForm;
