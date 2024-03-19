// AuthMiddleware.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthMiddleware = ({ children }) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        // User is not logged in, redirect to the login page
        return <Navigate to="/login" />;
    }

    // User is logged in, render the children components
    return children;
};

export default AuthMiddleware;
