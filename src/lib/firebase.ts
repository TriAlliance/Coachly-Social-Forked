import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDr2a-sdJQGRsUgLJLKOlDXjv0C2f6KDfw",
  authDomain: "coachly-adaa2.firebaseapp.com",
  projectId: "coachly-adaa2",
  storageBucket: "coachly-adaa2.firebasestorage.app",
  messagingSenderId: "109870351058",
  appId: "1:109870351058:web:50feb9c9195c7eb218230b",
  measurementId: "G-RBRZHCVCHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;