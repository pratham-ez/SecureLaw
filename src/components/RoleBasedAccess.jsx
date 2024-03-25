import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const RoleBasedAccess = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        navigate('/login');
      } else {
        const userData = querySnapshot.docs[0].data();
        setUserRole(userData.role);
      }
    };

    fetchUserRole();
  }, [navigate]);

  const checkAccess = () => {
    const accessRules = {
      police: ['/', '/createfir', '/policehome'],
      lawyer: ['/', '/lawyerhome', '/createcase'],
      user: ['/', '/userhome'],
      judge: ['/', '/judgehome', '/createcase']
    };

    const allowedRoutes = accessRules[userRole] || [];
    const currentPath = location.pathname;
    return allowedRoutes.includes(currentPath);
  };

  if (!userRole || !checkAccess()) {
    return null; 
  }

  return children;
};

export default RoleBasedAccess;
