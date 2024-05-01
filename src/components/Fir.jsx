import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import { db } from '../firebase-config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Fir.css';

const Fir = () => {
  const navigate = useNavigate();
  const [firData, setFirData] = useState({
    policeId: '',
    userId: '',
    date: '',
    name: '',
    phone: '',
    email: '',
    status: 'ongoing',
    offencelocation: '',
    offense: '',
    detailsOfTheIncident: '',
    relevantInformation: 'NA',
    documentLinks: [],
    firId: '',
    documentCount: 0
  });
  const [files, setFiles] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const generateFirId = () => {
    // Example of generating a simple unique ID, you can replace this with your own logic
    return `Fir${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFirData({ ...firData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadFiles = async (files) => {
    const storage = getStorage();
    let documentLinks = [];

    for (let file of files) {
      const fileRef = ref(storage, `firs/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      documentLinks.push(downloadUrl);
    }

    return documentLinks;
  };

  const sendData = async () => {
    try {
      const documentLinks = await uploadFiles(files);
      const firId = generateFirId();
      const updatedFirData = {
        ...firData,
        documentLinks: documentLinks,
        firId: firId,
        documentCount: documentLinks.length
      };
      await addDoc(collection(db, 'firs'), updatedFirData);

      console.log('FIR and files saved to Firestore successfully!');
      setSnackbarMessage('FIR submitted successfully!');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/policehome'), 6000);
    } catch (error) {
      console.error('Error saving FIR and files to Firestore:', error);
      setSnackbarMessage('FIR submission failed!');
      setOpenSnackbar(true);
    }
  };

  return (
    <div className='fir-container'>
      <h1>File FIR</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        sendData();
      }}>
        <div className="left-section">
          <label>
            Police ID:
            <input type="text" name="policeId" value={firData.policeId} onChange={handleChange} />
          </label>
          <label>
            User ID:
            <input type="text" name="userId" value={firData.userId} onChange={handleChange} />
          </label>
          <br />
          <label>
            Date:
            <input type="text" name="date" value={firData.date} onChange={handleChange} />
          </label>
          <br />
          <label>
            Name:
            <input type="text" name="name" value={firData.name} onChange={handleChange} />
          </label>
          <br />
          <label>
            Phone:
            <input type="text" name="phone" value={firData.phone} onChange={handleChange} />
          </label>
          <br />
          <label>
            Email:
            <input type="email" name="email" value={firData.email} onChange={handleChange} />
          </label>
          <br />
        </div>
        <div className="right-section">
          <label>
            Offense Location:
            <input type="text" name="offencelocation" value={firData.offencelocation} onChange={handleChange} />
          </label>
          <br />
          <label>
            Offense:
            <input type="text" name="offense" value={firData.offense} onChange={handleChange} />
          </label>
          <br />
          <label>
            Details of the Incident:
            <textarea name="detailsOfTheIncident" value={firData.detailsOfTheIncident} onChange={handleChange} />
          </label>
          <br />
          <label>
            Relevant Information:
            <textarea name="relevantInformation" value={firData.relevantInformation} onChange={handleChange} />
          </label>
          <br />
          <label>
            Attach Documents:
            <input type="file" multiple onChange={handleFileChange} />
          </label>
          <br />
        </div>
        <button type="submit">Submit FIR</button>
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

export default Fir;
