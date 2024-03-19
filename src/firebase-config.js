// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCc6iSBoaVLZqSRzIan9lKR2fqOtLiZzdc",
  authDomain: "law-86ac0.firebaseapp.com",
  projectId: "law-86ac0",
  storageBucket: "law-86ac0.appspot.com",
  messagingSenderId: "603481627844",
  appId: "1:603481627844:web:fa93485e21b452e0687d91",
  measurementId: "G-CDVMDR120D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Auth

export { db, auth };