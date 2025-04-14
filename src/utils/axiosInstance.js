import axios from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

instance.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem('token');
            history.push('/login');
        } else if (status === 403) {
            history.push('/main');
        }

        return Promise.reject(error);
    }
);

export default instance;
