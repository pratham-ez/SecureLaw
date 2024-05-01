import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import './JudgeHome.css'
import { useNavigate } from 'react-router-dom';

const JudgeHome = () => {
  const [courtCases, setCourtCases] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCourtCases = async () => {
      const casesRef = collection(db, 'cases');
      const q = query(casesRef, where('judgeId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedCases = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()  // This spreads all data fields
      }));
      setCourtCases(fetchedCases);
    };

    if (userId) {
      fetchCourtCases();
    }
  }, [userId]);

  const handleStatusChange = async (caseId, newStatus) => {
    const caseRef = doc(db, 'cases', caseId);
    await updateDoc(caseRef, {
      status: newStatus
    });
    fetchCourtCases(); // Refresh case list after updating
  };

  const navigate = useNavigate();

  return (
    <div className="judge-home-container">
      <h1>JudgeHome</h1>
      <h2>Court Cases</h2>
      <div className="cases-container">
        {courtCases.map(caseItem => (
          <div key={caseItem.id} className="case-card">
            <h3>Case ID: {caseItem.caseId}</h3>
            <p>Status: {caseItem.status}</p>
            <p>Case Number: {caseItem.caseNumber}</p>
            <p>Case Type: {caseItem.caseType}</p>
            <p>FIR ID: {caseItem.firId}</p>
            <select 
              defaultValue={caseItem.status} 
              onChange={(e) => handleStatusChange(caseItem.id, e.target.value)}
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button className="button" onClick={() => navigate('/createcase')}>Create New Case</button>
        <button className="button" onClick={() => navigate('/viewcase')}>View Case Details</button>
        </div>
    </div>
  );
};

export default JudgeHome;
