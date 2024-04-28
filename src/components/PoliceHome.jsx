import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const PoliceHome = () => {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [firs, setFirs] = useState([]);
  const [courtCases, setCourtCases] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchFirs();
    fetchCourtCases();
    fetchUser();
  }, [userId]);

  const fetchFirs = async () => {
    const firsRef = collection(db, 'firs');
    const q = query(firsRef, where('policeId', '==', userId));
    const querySnapshot = await getDocs(q);
    const fetchedFirs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setFirs(fetchedFirs);
  };

  const fetchCourtCases = async () => {
    const casesRef = collection(db, 'cases');
    const q = query(casesRef, where('policeId', '==', userId)); 
    const querySnapshot = await getDocs(q);
    const fetchedCases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCourtCases(fetchedCases);
  };

  const fetchUser = async () => {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('userId', '==', userId)); 
    const querySnapshot = await getDocs(q);
    const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const fetchedUser = fetchedUsers.length > 0 ? fetchedUsers[0] : null;
    setUser(fetchedUser);
  };

  const handleStatusChange = async (firId, newStatus) => {
    const firRef = doc(db, 'firs', firId);
    await updateDoc(firRef, {
      status: newStatus
    });
    fetchFirs(); // Refresh FIR list after updating
  };

  return (
    <div>
      <h1>PoliceHome</h1>
      {user && <p>User: {user.userName}</p>}
      <h2>FIRs</h2>
      <ul>
        {firs.map(fir => (
          <li key={fir.id}>
            FIR ID: {fir.firId} - Status: {fir.status} - Date: {fir.date} - Offense: {fir.offense}
            <select 
              defaultValue={fir.status} 
              onChange={(e) => handleStatusChange(fir.id, e.target.value)}
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </li>
        ))}
      </ul>
      <h2>Court Cases</h2>
      <ul>
        {courtCases.map(caseItem => (
          <li key={caseItem.id}>
            Case ID: {caseItem.caseId} - Status: {caseItem.status}
          </li>
        ))}
      </ul>
      <Link to="/viewfir">View FIR Details</Link>
      <br/>
      <Link to="/createfir">Create New FIR</Link>
    </div>
  );
};

export default PoliceHome;
