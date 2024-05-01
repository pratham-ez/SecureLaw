import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import './PoliceHome.css'
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  return (
    <div className='police-home-container'>
      <h1>PoliceHome</h1>
      <p className="user-text">User: {user && <span className="user-display">{user.userName}</span>}</p>

      
      <div className="sections-container">
        <div className="section fir-section">
          <h2>FIRs</h2>
          {firs.map(fir => (
            <div key={fir.id} className="card">
              <h3>FIR ID: {fir.firId}</h3>
              <p>Status: {fir.status}</p>
              <p>Date: {fir.date}</p>
              <p>Offense: {fir.offense}</p>
              <select 
                defaultValue={fir.status} 
                onChange={(e) => handleStatusChange(fir.id, e.target.value)}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          ))}
        </div>
        
        <div className="section court-cases-section">
          <h2>Court Cases</h2>
          {courtCases.map(caseItem => (
            <div key={caseItem.id} className="card">
              <h3>Case ID: {caseItem.caseId}</h3>
              <p>Status: {caseItem.status}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="button-container">
        <button onClick={() => navigate('/viewfir')}>View FIR Details</button>
        <button onClick={() => navigate('/createfir')}>Create New FIR</button>
      </div>
    </div>
  );
};

export default PoliceHome;
