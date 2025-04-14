import React, {useEffect} from 'react';
import styles from '../styles/Auth.module.css'
import LoginForm from "./LoginForm";
import {isAuthenticated} from "../utils/auth";
import {useNavigate} from "react-router";

const Auth = () => {

    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated()){
            navigate('/main')
        }
    }, [navigate]);

    return (
        <div className={styles.container}>

            <div className={styles.center}>

                <div className={styles.info}>
                    <div className={styles.title}>Про платформу</div>

                    <div className={styles.text}>
                        Наша платформа — це простір для психологічної підтримки та допомоги. Записуйтеся на консультації, проходьте тести для оцінки емоційного стану та отримуйте рекомендації. Спілкуйтеся з лікарями, відстежуйте лікування та діліться досвідом з іншими. Ваше психологічне здоров’я — наш пріоритет.
                    </div>
                </div>
                <LoginForm />

            </div>

        </div>
    );
};

export default Auth;
