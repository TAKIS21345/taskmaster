import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFlzS6bNCYVnH4P8N5Y0qGVVGGh0qqN1w",
  authDomain: "child-schedule.firebaseapp.com",
  projectId: "child-schedule",
  storageBucket: "child-schedule.appspot.com",
  messagingSenderId: "1050389674933",
  appId: "1:1050389674933:web:7e9e98256c93ec3c2d77fc",
  measurementId: "G-EHQVQGSNNX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Note: Removed enableIndexedDbPersistence as it's causing issues
// Firestore will still work without it, just won't have offline persistence