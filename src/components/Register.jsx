import React, { useState } from 'react';
import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import { db } from '../firebase-config';


function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    gender: '',
    phone: '',
    userName: '',
    role: 'police',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const sendData = async () => {
    try {
      await addDoc(collection(db, 'users'), formData);
      console.log('Data saved to Firestore successfully!');
      setSnackbarMessage('Registration successful!');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/login'), 6000);
    } catch (error) {
      console.error('Error writing document to Firestore:', error);
      setSnackbarMessage('Registration failed!');
      setOpenSnackbar(true);
    }
    
    const url = 'https://6e7fmblmdjgby6o5fnnxeaelhm0iouhb.lambda-url.ap-south-1.on.aws/hack/user';

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        sendData();
      }}>
        <label>
          User ID:
          <input type="text" name="userId" value={formData.userId} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <br />
        <label>
          Phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </label>
        <br />
        <label>
          Username:
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="police">Police</option>
            <option value="judge">Judge</option>
            <option value="lawyer">Lawyer</option>
            <option value="user">User</option>
          </select>
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
}

export default Register;
