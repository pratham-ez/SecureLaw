import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth';
import { auth, db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Login = () => {
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const fetchPhoneNumber = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      console.log(userData.phone);
      return userData;
    } else {
      toast.error('No user found with this ID');
      return null;
    }
  };

  const sendOtp = async () => {
    try {
      const data = await fetchPhoneNumber();
      if (data) {
        const fetchedPhone = data.phone;
        const inputPhone = phone.replace('+91', '');
        if (fetchedPhone === inputPhone) {
          const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {})
          const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha)
          setUser(confirmation)
          toast.info("OTP sent successfully");
        } else {
          toast.error("Wrong user or phone number");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const fdata = await fetchPhoneNumber();
      if (fdata) {
        const role = fdata.role;
        await user.confirm(otp);
        toast.success("Login successful");
        localStorage.setItem('userId', userId);

        const navigatePath = role === 'police' ? '/policehome' : 
                             role === 'user' ? '/userhome' : 
                             role === 'lawyer' ? '/lawyerhome' : '/judgehome';

        navigate(navigatePath, { state: { userId: userId } });
      }
    } catch (error) {
      console.error(error);
      toast.error("Wrong OTP, please try again");
      navigate('/');
    }
  };

  return (
    <div>
      <TextField
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        label="Enter User ID"
      />
      <br />
      <PhoneInput
        country={'in'}
        value={phone}
        onChange={(phone) => setPhone("+" + phone)}
      />
      <Button onClick={sendOtp} variant='contained'>Send Otp</Button>
      <div id='recaptcha'></div>
      <br />
      <TextField onChange={(e) => setOtp(e.target.value)} label="Enter OTP" />
      <br />
      <Button onClick={verifyOtp} variant='contained'>Verify Otp</Button>
      <ToastContainer />
    </div>
  );
};

export default Login;
