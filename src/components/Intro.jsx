import React from 'react';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div>
      <h1>SecureLaw</h1>
      <button onClick={handleLoginClick}>Log In</button>
      <button onClick={handleRegisterClick}>Register</button>
    </div>
  );
};

export default Intro;
