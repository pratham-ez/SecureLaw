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
          <h2>Case ID: {caseData.caseId}</h2>
          <p>Case Number: {caseData.caseNumber}</p>
          <p>Case Type: {caseData.caseType}</p>
          <p>Filing Date: {caseData.filingDate}</p>
          <p>Status: {caseData.status}</p>
          <p>FIR ID: {caseData.firId}</p>
          <p>Plaintiff Name: {caseData.plaintiffName}</p>
          <p>Plaintiff Address: {caseData.pAddress}</p>
          <p>Plaintiff Case Details: {caseData.pCaseDetails}</p>
          <p>Plaintiff Lawyer ID: {caseData.pLawyersId}</p>
          <p>Plaintiff Phone: {caseData.pPhone}</p>
          <p>Defendant Name: {caseData.defendantName}</p>
          <p>Defendant Address: {caseData.dAddress}</p>
          <p>Defendant Case Details: {caseData.dCaseDetails}</p>
          <p>Defendant Lawyer ID: {caseData.dLawyersId}</p>
          <p>Defendant Phone: {caseData.dPhone}</p>
          <p>Judge's Hearings and Notes: {caseData.judgeHearings}</p>
          <div className="document-links">
            {caseData.documents && caseData.documents.map((link, index) => (
              <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                Document {index + 1}
              </a>
            ))}
          </div>
          {caseData.images && caseData.images.map((image, index) => (
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
