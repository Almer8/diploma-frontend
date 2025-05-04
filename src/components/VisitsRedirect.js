import React from 'react';

import {getUserRoles} from "../utils/auth";
import PatientVisitsView from "./PatientVisitsView";
import DoctorVisitsView from "./DoctorVisitsView";

const VisitsRedirect = () => {

    const roles = getUserRoles();

    if(roles.includes('PATIENT')){
        return (
            <PatientVisitsView/>
        )
    }
    if(roles.includes('DOCTOR')){
        return (
            <DoctorVisitsView/>
        )
    }
};

export default VisitsRedirect;
