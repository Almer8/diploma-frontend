import React from 'react';
import {getUserRoles} from "../utils/auth";
import PatientMain from "./main/PatientMain";
import DoctorMain from "./main/DoctorMain";
const MainRedirect = () => {

    const roles = getUserRoles();
    if (roles.includes('PATIENT')) {
        return (
            <PatientMain/>
        )
    }
    if (roles.includes('DOCTOR')) {
        return (
            <DoctorMain/>
        )
    }
};

export default MainRedirect;
