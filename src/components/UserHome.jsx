import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const UserHome = () => {
  const userId = localStorage.getItem('userId') || '';
  const [firs, setFirs] = useState([]);
  const [courtCases, setCourtCases] = useState([]);

  useEffect(() => {
    const fetchFirs = async () => {
      const firsRef = collection(db, 'firs');
      const q = query(firsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedFirs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    <div>
      <h1>UserHome</h1>
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
    </div>
  );
};

export default UserHome;
