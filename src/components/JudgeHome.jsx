import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

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

  return (
    <div>
      <h1>JudgeHome</h1>
      <h2>Court Cases</h2>
      <ul>
        {courtCases.map(caseItem => (
          <li key={caseItem.id}>
            Case ID: {caseItem.caseId} - 
            Status: {caseItem.status} - 
            Case Number: {caseItem.caseNumber} - 
            Case Type: {caseItem.caseType} - 
            FIR ID: {caseItem.firId}
            <select 
              defaultValue={caseItem.status} 
              onChange={(e) => handleStatusChange(caseItem.id, e.target.value)}
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </li>
        ))}
      </ul>
      <Link to="/createcase">Create New Case</Link>
      <br />
      <Link to="/viewcase">View Case Details</Link>
    </div>
  );
};

export default JudgeHome;
