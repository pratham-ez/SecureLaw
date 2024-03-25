import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const JudgeHome = () => {
  const [courtCases, setCourtCases] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCourtCases = async () => {
      const casesRef = collection(db, 'cases');
      const q = query(casesRef, where('judgeId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedCases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourtCases(fetchedCases);
    };

    if (userId) {
      fetchCourtCases();
    }
  }, [userId]);

  return (
    <div>
      <h1>JudgeHome</h1>
      <h2>Court Cases</h2>
      <ul>
        {courtCases.map(caseItem => (
          <li key={caseItem.id}>{caseItem.caseId} - {caseItem.status}</li>
        ))}
      </ul>
      <Link to="/createcase">Create New Case</Link>
      <br />
      <Link to="/viewcase">View Case Details</Link>
    </div>
  );
};

export default JudgeHome;
