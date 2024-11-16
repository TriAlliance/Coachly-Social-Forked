import { initializeApp, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  getDocs,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

export async function initializeFirebaseRules() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Initialize system roles
    await setDoc(doc(db, 'system', 'roles'), {
      superAdmins: ['ollie@tri-alliance.com.au'],
      lastUpdated: serverTimestamp(),
      updatedBy: 'system'
    });

    // Initialize system settings
    await setDoc(doc(db, 'system', 'settings'), {
      allowSignups: true,
      requireEmailVerification: true,
      maxUploadSize: 5242880, // 5MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
      lastUpdated: serverTimestamp(),
      updatedBy: 'system'
    });

    console.log('Firebase rules and initial data successfully initialized');
    return true;

  } catch (error) {
    console.error('Error initializing Firebase rules:', error);
    throw error;
  }
}

export async function verifySuperAdmin(email: string) {
  try {
    const db = getFirestore(getApp());
    
    // Check if user exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Create user if doesn't exist
      await setDoc(doc(db, 'users', 'superadmin'), {
        email,
        role: 'superadmin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      });
    }

    // Verify user is in superAdmins list
    const rolesDoc = await getDocs(doc(db, 'system', 'roles'));
    if (!rolesDoc.exists()) {
      throw new Error('System roles document not found');
    }

    const superAdmins = rolesDoc.data()?.superAdmins || [];
    if (!superAdmins.includes(email)) {
      // Add to superAdmins if not present
      await setDoc(doc(db, 'system', 'roles'), {
        superAdmins: [...superAdmins, email],
        lastUpdated: serverTimestamp(),
        updatedBy: 'system'
      }, { merge: true });
    }

    console.log(`Super admin ${email} verified successfully`);
    return true;

  } catch (error) {
    console.error('Error verifying super admin:', error);
    throw error;
  }
}