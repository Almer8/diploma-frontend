import React from 'react';
import styles from '../../styles/headers/UnauthorizedHeader.module.css'


const UnauthorizedHeader = () => {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>Logo</div>
            <div className={styles.headertext}>Назва платформи</div>
        </div>
    );
};
export default UnauthorizedHeader;
