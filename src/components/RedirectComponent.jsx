import {useEffect} from 'react';
import {isAuthenticated} from "../utils/auth";
import {useNavigate} from "react-router";

const RedirectComponent = () => {

    const navigate = useNavigate();
    useEffect(()=>{
        if(isAuthenticated()){
            navigate('/main');
        } else {
            navigate('/login');
        }

    },[navigate])
    return null;
};

export default RedirectComponent;
