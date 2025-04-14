import {jwtDecode} from "jwt-decode";

export function getToken() {
    return localStorage.getItem('token');
}
export const getUserRoles = () => {
    const token = localStorage.getItem('token');
    if (!token) return [];

    try {
        const decoded = jwtDecode(token);
        return decoded.role?.map(r => r.authority) || [];
    } catch (e) {
        return [];
    }
};

export function isAuthenticated() {
    return !!getToken();
}

export function getId() {
    const decoded = jwtDecode(getToken());
    return decoded.id
}
