import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ViewCase = () => {
  const [caseIdInput, setCaseIdInput] = useState('');
  const [caseData, setCaseData] = useState(null);
  const userId = localStorage.getItem('userId');

  const handleCaseIdInputChange = (event) => {
    setCaseIdInput(event.target.value);
  };

  const fetchCase = async () => {
    try {
      const casesRef = collection(db, 'cases');
      const q = query(casesRef, where('caseId', '==', caseIdInput));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const caseDoc = querySnapshot.docs[0];
        setCaseData({ id: caseDoc.id, ...caseDoc.data() });
      } else {
        console.log('Case not found with the provided ID');
        setCaseData(null);
      }
    } catch (error) {
      console.error('Error fetching case:', error);
    }
  };

  useEffect(() => {
    if (caseIdInput.trim() && userId) {
      fetchCase();
    }
  }, [caseIdInput, userId]);

  return (
    <div>
      <h1>View Case</h1>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <input
          type="text"
          value={caseIdInput}
          onChange={handleCaseIdInputChange}
          placeholder="Enter Case ID"
        />
        <button type="button" onClick={fetchCase}>Fetch Case</button>
      </form>
      {caseData && (
        <div className="case-details">
          <h2>{caseData.caseId}</h2>
          <p>Case Number: {caseData.caseNumber}</p>
          <p>Case Type: {caseData.caseType}</p>
          <p>Filing Date: {caseData.filingDate}</p>
          {/* Add more fields as needed */}
          <div className="document-links">
            {caseData.documents && caseData.documents.length > 0 &&
              caseData.documents.map((link, index) => (
                <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                  Document {index + 1}
                </a>
              ))}
          </div>
          {/* Add styling for images with small width and height */}
          {caseData.images && caseData.images.length > 0 &&
            caseData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
              />
            ))}
        </div>
      )}
      {!caseData && (
        <div>No case found with the provided ID.</div>
      )}
    </div>
  );
};

export default ViewCase;
