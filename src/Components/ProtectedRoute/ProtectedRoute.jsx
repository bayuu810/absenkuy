import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage

    if (!token) {
        // Jika tidak ada token, arahkan ke halaman login
        return <Navigate to="/" />;
    }

    return children; // Jika ada token, lanjutkan ke halaman yang diminta
};

export default ProtectedRoute;
