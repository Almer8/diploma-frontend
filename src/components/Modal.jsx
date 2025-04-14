import React from 'react';
import styles from '../styles/Modal.module.css'

const Modal = ({component, onClose}) => {
    return (
        <div className={styles.modalwrapper} onClick={()=> onClose()}>
            {component}
        </div>
    );
};

export default Modal;
