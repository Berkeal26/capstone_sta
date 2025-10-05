// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBRDXXdNpCQlkzu7-ZwBbr7NTjEs8qh9mU",
  authDomain: "smart-travel-assistant-946f9.firebaseapp.com",
  projectId: "smart-travel-assistant-946f9",
  storageBucket: "smart-travel-assistant-946f9.firebasestorage.app",
  messagingSenderId: "941934294159",
  appId: "1:941934294159:web:dd70be1684787fd21bacfa",
  measurementId: "G-3PGS3K56VJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };