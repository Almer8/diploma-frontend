import React from 'react';
import {getUserRoles} from "../utils/auth";
import UnauthorizedHeader from "./headers/UnauthorizedHeader";
import PatientHeader from "./headers/PatientHeader";

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

};

export default HeaderRedirect;
