// App.js
import { useState } from 'react';
import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Intro from './components/Intro';
import Login from './components/Login';
import Register from './components/Register';
import UserHome from './components/UserHome';
import PoliceHome from './components/PoliceHome';
import LawyerHome from './components/LawyerHome';
import JudgeHome from './components/JudgeHome';
import Fir from './components/Fir';
import CreateCase from './components/CreateCase';
import AuthMiddleware from './components/AuthMiddleware'; 
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userhome" element={
          <AuthMiddleware>
            <UserHome />
          </AuthMiddleware>
        } />
        <Route path="/policehome" element={
          <AuthMiddleware>
            <PoliceHome />
          </AuthMiddleware>
        } />
        <Route path="/lawyerhome" element={
          <AuthMiddleware>
            <LawyerHome />
          </AuthMiddleware>
        } />
        <Route path="/judgehome" element={
          <AuthMiddleware>
            <JudgeHome />
          </AuthMiddleware>
        } />
        <Route path="/createfir" element={
          <AuthMiddleware>
            <Fir />
          </AuthMiddleware>
        } />
        <Route path="/createcase" element={
          <AuthMiddleware>
            <CreateCase />
          </AuthMiddleware>
        } />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
