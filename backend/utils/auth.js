// utils/auth.js

export const isLoggedIn = () => {
    return !!localStorage.getItem('token'); // Check if token exists in localStorage
};

export const getRole = () => {
    return localStorage.getItem('role'); // Retrieve the user role from localStorage
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
   
};
