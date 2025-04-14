import React from 'react';
import HeaderRedirect from "./HeaderRedirect";
import styles from "../styles/Layout.module.css"
import {Outlet} from "react-router";

const Layout = () => {
    return (
        <div className={styles.content}>
            <HeaderRedirect/>


            <div className={styles.outletWrapper}>
                <Outlet/>
            </div>


        </div>
    );
};

export default Layout;
