import React from 'react';

import {getUserRoles} from "../utils/auth";
import PatientVisitView from "./PatientVisitView";
import DoctorVisitView from "./DoctorVisitView";
import {useLocation} from "react-router";


const VisitRedirect = () => {
    const location = useLocation()
    const visit = location.state?.visit;
    const user = location.state?.user;

    const roles = getUserRoles();

    if(roles.includes('PATIENT')){
        return (
            <PatientVisitView visit={visit} user={user}/>
        )
    }
    if(roles.includes('DOCTOR')){
        return (
            <DoctorVisitView visit={visit} user={user}/>
        )
    }
};

export default VisitRedirect;
