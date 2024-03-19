import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import { db } from '../firebase-config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateCase = () => {
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState({
    caseId: '',
    caseNumber: '',
    caseType: '',
    filingDate: '',
    policeId : '',
    firId: '',
    judgeId: '',
    pLawyersId: '',
    dLawyersId: '',
    plaintiffName: '',
    pAddress: '',
    pPhone: '',
    defendantName: '',
    dAddress: '',
    dPhone: '',
    pCaseDetails: '',
    dCaseDetails: '',
    documents: [],
    status: '',
    judgeHearings: '',
    documentCount: 0
  });
  const [files, setFiles] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaseData({ ...caseData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadFiles = async (files) => {
    const storage = getStorage();
    let documentLinks = [];

    for (let file of files) {
      const fileRef = ref(storage, `cases/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      documentLinks.push(downloadUrl);
    }

    return documentLinks;
  };

  const checkFirIdExists = async (firId) => {
    const firsRef = collection(db, 'firs');
    const q = query(firsRef, where('firId', '==', firId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const checkUserIdExists = async (userId) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const validateData = async () => {
    const { firId, judgeId, pLawyersId, dLawyersId } = caseData;

    if (firId && !(await checkFirIdExists(firId))) {
      throw new Error('FIR ID does not exist');
    }

    if (judgeId && !(await checkUserIdExists(judgeId))) {
      throw new Error('Judge ID does not exist');
    }

    if (pLawyersId && !(await checkUserIdExists(pLawyersId))) {
      throw new Error('Plaintiff Lawyer ID does not exist');
    }

    if (dLawyersId && !(await checkUserIdExists(dLawyersId))) {
      throw new Error('Defendant Lawyer ID does not exist');
    }
  };

  const sendData = async () => {
    try {
      await validateData();
      const documentLinks = await uploadFiles(files);
      const updatedCaseData = {
        ...caseData,
        documents: documentLinks,
        documentCount: documentLinks.length
      };
      await addDoc(collection(db, 'cases'), updatedCaseData);

      console.log('Case and documents saved to Firestore successfully!');
      setSnackbarMessage('Case created successfully!');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/lawyerhome'), 6000);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage(error.message || 'Case creation failed!');
      setOpenSnackbar(true);
    }
  };

  return (
    <div>
      <h1>Create Case</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        sendData();
      }}>
        {/* Form inputs */}
        <label>
          Case ID:
          <input type="text" name="caseId" value={caseData.caseId} onChange={handleChange} />
        </label>
        <label>
          Case Number:
          <input type="text" name="caseNumber" value={caseData.caseNumber} onChange={handleChange} />
        </label>
        <br />
        <label>
          Case Type:
          <input type="text" name="caseType" value={caseData.caseType} onChange={handleChange} />
        </label>
        <br />
        <label>
          Filing Date:
          <input type="date" name="filingDate" value={caseData.filingDate} onChange={handleChange} />
        </label>
        <br />
        <label>
          FIR ID:
          <input type="text" name="firId" value={caseData.firId} onChange={handleChange} />
        </label>
        <br />
        <label>
          Judge ID:
          <input type="text" name="judgeId" value={caseData.judgeId} onChange={handleChange} />
        </label>
        <label>
          Police ID:
          <input type="text" name="policeId" value={caseData.policeId} onChange={handleChange} />
        </label>
        <br />
        <label>
          Plaintiff Lawyers ID:
          <input type="text" name="pLawyersId" value={caseData.pLawyersId} onChange={handleChange} />
        </label>
        <br />
        <label>
          Defendant Lawyers ID:
          <input type="text" name="dLawyersId" value={caseData.dLawyersId} onChange={handleChange} />
        </label>
        <br />
        <label>
          Plaintiff Name:
          <input type="text" name="plaintiffName" value={caseData.plaintiffName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Plaintiff Address:
          <input type="text" name="pAddress" value={caseData.pAddress} onChange={handleChange} />
        </label>
        <br />
        <label>
          Plaintiff Phone:
          <input type="tel" name="pPhone" value={caseData.pPhone} onChange={handleChange} />
        </label>
        <br />
        <label>
          Defendant Name:
          <input type="text" name="defendantName" value={caseData.defendantName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Defendant Address:
          <input type="text" name="dAddress" value={caseData.dAddress} onChange={handleChange} />
        </label>
        <br />
        <label>
          Defendant Phone:
          <input type="tel" name="dPhone" value={caseData.dPhone} onChange={handleChange} />
        </label>
        <br />
        <label>
          Plaintiff Case Details:
          <textarea name="pCaseDetails" value={caseData.pCaseDetails} onChange={handleChange} />
        </label>
        <br />
        <label>
          Defendant Case Details:
          <textarea name="dCaseDetails" value={caseData.dCaseDetails} onChange={handleChange} />
        </label>
        <br />
        <label>
          Status:
          <input type="text" name="status" value={caseData.status} onChange={handleChange} />
        </label>
        <br />
        <label>
          Judge Hearings:
          <input type="text" name="judgeHearings" value={caseData.judgeHearings} onChange={handleChange} />
        </label>
        <br />
        <label>
          Attach Documents:
          <input type="file" multiple onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">Create Case</button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default CreateCase;
