import React from 'react';
import {getUserRoles} from "../utils/auth";
import PatientMain from "./main/PatientMain";
const MainRedirect = () => {

    const roles = getUserRoles();
    if (roles.includes('PATIENT')) {
        return (
            <PatientMain/>
        )
    }
};

export default MainRedirect;
