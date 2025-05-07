import React from 'react';
import {getUserRoles} from "../utils/auth";
import UnauthorizedHeader from "./headers/UnauthorizedHeader";
import PatientHeader from "./headers/PatientHeader";
import DoctorHeader from "./headers/DoctorHeader";
import AdminHeader from "./headers/AdminHeader";

const HeaderRedirect = () => {

    const roles = getUserRoles();

    if(roles.length === 0){
        return (
            <UnauthorizedHeader/>
        );
    }
    if(roles.includes('PATIENT')){
        return (
            <PatientHeader/>
        )
    }
    if(roles.includes('DOCTOR')){
        return (
            <DoctorHeader/>
        )
    }
    if(roles.includes('ADMIN')){
        return (
            <AdminHeader/>
        )
    }

};

export default HeaderRedirect;
