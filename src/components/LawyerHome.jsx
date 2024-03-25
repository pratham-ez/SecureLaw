import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LawyerHome = () => {
  const [cases, setCases] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCases = async () => {
      const casesRef = collection(db, 'cases');
      // Query for cases where the current user is either the defendant's lawyer or the plaintiff's lawyer
      const q1 = query(casesRef, where('dLawyersId', '==', userId));
      const q2 = query(casesRef, where('pLawyersId', '==', userId));
      
      const querySnapshot1 = await getDocs(q1);
      const querySnapshot2 = await getDocs(q2);
      
      const fetchedCases1 = querySnapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const fetchedCases2 = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Combine and deduplicate the cases
      const combinedCases = [...fetchedCases1, ...fetchedCases2.filter(c => !fetchedCases1.find(fc => fc.id === c.id))];
      setCases(combinedCases);
    };

    if (userId) {
      fetchCases();
    }
  }, [userId]);

  return (
    <div>
      <h1>LawyerHome</h1>
      <h2>Your Cases</h2>
      <ul>
        {cases.map(caseItem => (
          <li key={caseItem.id}>
            {caseItem.caseId} - {caseItem.status}
          </li>
        ))}
      </ul>
      <br />
      <Link to="/viewcase">View Case Details</Link>
    </div>
  );
};

export default LawyerHome;
