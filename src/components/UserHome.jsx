import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './UserHome.css'
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
  const userId = localStorage.getItem('userId') || '';
  const [firs, setFirs] = useState([]);
  const [courtCases, setCourtCases] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFirs = async () => {
      const firsRef = collection(db, 'firs');
      const q = query(firsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedFirs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() // This fetches all the fields
      }));
      setFirs(fetchedFirs);
    };

    const fetchCourtCases = async () => {
      const casesRef = collection(db, 'cases');
      const q1 = query(casesRef, where('plaintiffId', '==', userId));
      const q2 = query(casesRef, where('defendantId', '==', userId));
      const querySnapshot1 = await getDocs(q1);
      const querySnapshot2 = await getDocs(q2);
      const fetchedCases = [
        ...querySnapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];
      setCourtCases(fetchedCases);
    };

    if (userId) {
      fetchFirs();
      fetchCourtCases();
    }
  }, [userId]);

  return (
    <div className="user-home-container">
    <h1>UserHome</h1>
    <div className="sections-container">
      <div className="section fir-section">
        <h2>FIRs</h2>
        <div className="fir-cards">
          {firs.map(fir => (
            <div key={fir.id} className="card">
              <p className='high1'>FIR ID: {fir.firId}</p>
              <p>Status: {fir.status}</p>
              <p>Date: {fir.date}</p>
              <p>Offense: {fir.offense}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="section court-cases-section">
        <h2>Court Cases</h2>
        <div className="court-cases-cards">
          {courtCases.map(caseItem => (
            <div key={caseItem.id} className="card">
              <p className='high2'>Case ID: {caseItem.caseId}</p>
              <p>Status: {caseItem.status}</p>
              <p>Case Number: {caseItem.caseNumber}</p>
              <p>Case Type: {caseItem.caseType}</p>
              <p>FIR ID: {caseItem.firId}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="button-container">
      <button onClick={() => navigate('/viewcase')}>View Case Details</button>
      <button onClick={() => navigate('/viewfir')}>View FIR Details</button>
    </div>
  </div>
      
  );
};

export default UserHome;
