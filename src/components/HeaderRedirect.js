import React from 'react';
import {getUserRoles} from "../utils/auth";
import UnauthorizedHeader from "./headers/UnauthorizedHeader";
import PatientHeader from "./headers/PatientHeader";
import DoctorHeader from "./headers/DoctorHeader";

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

};

export default HeaderRedirect;
