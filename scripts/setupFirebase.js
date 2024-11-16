import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDr2a-sdJQGRsUgLJLKOlDXjv0C2f6KDfw",
  authDomain: "coachly-adaa2.firebaseapp.com",
  projectId: "coachly-adaa2",
  storageBucket: "coachly-adaa2.firebasestorage.app",
  messagingSenderId: "109870351058",
  appId: "1:109870351058:web:50feb9c9195c7eb218230b",
  measurementId: "G-RBRZHCVCHW"
};

async function setupFirebase() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Initialize system roles
    await setDoc(doc(db, 'system', 'roles'), {
      superAdmins: ['ollie@tri-alliance.com.au'],
      lastUpdated: serverTimestamp(),
      updatedBy: 'system'
    }, { merge: true });

    // Initialize system settings
    await setDoc(doc(db, 'system', 'settings'), {
      allowSignups: true,
      requireEmailVerification: true,
      maxUploadSize: 5242880, // 5MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
      lastUpdated: serverTimestamp(),
      updatedBy: 'system'
    }, { merge: true });

    console.log('Firebase setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Firebase setup failed:', error);
    process.exit(1);
  }
}

setupFirebase();