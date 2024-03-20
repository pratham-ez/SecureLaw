import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Header.css'; 

const Header = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('userId', '==', userId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    console.log(userData.role)
                    setRole(userData.role);
                    console.log(role)
                }
            }
        };
        

        fetchUserRole();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    const homePath = role === 'police' ? '/policehome' : 
                     role === 'user' ? '/userhome' : 
                     role === 'lawyer' ? '/lawyerhome' : '/judgehome';
    
                     console.log(homePath)
    return (
        <header className="header-nav"> 
            <Link to="/" className="logo">SecureLaw</Link>
            <Link to={homePath}>Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <button onClick={handleLogout}>Logout</button>
        </header>
    );
};

export default Header;
