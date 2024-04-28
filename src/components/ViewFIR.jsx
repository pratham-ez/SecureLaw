import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ViewFIR = () => {
  const [firIdInput, setFirIdInput] = useState('');
  const [firData, setFirData] = useState(null);
  const userId = localStorage.getItem('userId');

  const handleFirIdInputChange = (event) => {
    setFirIdInput(event.target.value);
  };

  const fetchFIR = async () => {
    try {
      const firsRef = collection(db, 'firs');
      const q = query(firsRef, where('firId', '==', firIdInput));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const firDoc = querySnapshot.docs[0];
        setFirData({ id: firDoc.id, ...firDoc.data() });
      } else {
        console.log('FIR not found with the provided ID');
        setFirData(null);
      }
    } catch (error) {
      console.error('Error fetching FIR:', error);
    }
  };

  useEffect(() => {
    if (firIdInput.trim() && userId) {
      fetchFIR();
    }
  }, [firIdInput, userId]);

  return (
    <div>
      <h1>View FIR</h1>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <input
          type="text"
          value={firIdInput}
          onChange={handleFirIdInputChange}
          placeholder="Enter FIR ID"
        />
        <button type="button" onClick={fetchFIR}>Fetch FIR</button>
      </form>
      {firData && (
        <div className="fir-details">
          <h2>FIR ID: {firData.firId}</h2>
          <p>Name: {firData.name}</p>
          <p>Email: {firData.email}</p>
          <p>Phone: {firData.phone}</p>
          <p>Date: {firData.date}</p>
          <p>Offense Location: {firData.offencelocation}</p>
          <p>Offense: {firData.offense}</p>
          <p>Details of Incident: {firData.detailsOfTheIncident}</p>
          <p>Relevant Information: {firData.relevantInformation}</p>
          <p>Status: {firData.status}</p>
          <div className="document-links">
            {firData.documentLinks && firData.documentLinks.map((link, index) => (
              <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                Document {index + 1}
              </a>
            ))}
          </div>
          {firData.images && firData.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
            />
          ))}
        </div>
      )}
      {!firData && (
        <div>No FIR found with the provided ID.</div>
      )}
    </div>
  );
};

export default ViewFIR;
