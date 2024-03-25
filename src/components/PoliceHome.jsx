import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PoliceHome = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [firs, setFirs] = useState([]);
  const [courtCases, setCourtCases] = useState([]);

  useEffect(() => {
    const fetchFirs = async () => {
      const firsRef = collection(db, 'firs');
      const q = query(firsRef, where('policeId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedFirs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFirs(fetchedFirs);
    };

    const fetchCourtCases = async () => {
      const casesRef = collection(db, 'cases');
      const q = query(casesRef, where('policeId', '==', userId)); // Adjust the field as per your schema
      const querySnapshot = await getDocs(q);
      const fetchedCases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourtCases(fetchedCases);
    };

    if (userId) {
      fetchFirs();
      fetchCourtCases();
    }
  }, [userId]);

  return (
    <div>
      <h1>PoliceHome</h1>
      <h2>FIRs</h2>
      <ul>
        {firs.map(fir => (
          <li key={fir.id}>{fir.firId} - {fir.status}</li>
        ))}
      </ul>
      <h2>Court Cases</h2>
      <ul>
        {courtCases.map(caseItem => (
          <li key={caseItem.id}>{caseItem.caseId} - {caseItem.status}</li>
        ))}
      </ul>
      <Link to="/viewfir">View FIR Details</Link>
    </div>
  );
};

export default PoliceHome;
