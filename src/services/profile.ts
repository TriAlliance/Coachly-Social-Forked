import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';

export interface ProfileData {
  displayName?: string;
  bio?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export async function updateProfile(data: ProfileData) {
  if (!auth.currentUser) throw new Error('No authenticated user');

  try {
    // Update auth profile
    if (data.displayName) {
      await updateFirebaseProfile(auth.currentUser, {
        displayName: data.displayName
      });
    }

    // Update Firestore profile
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function updateLocation(location: ProfileData['location']) {
  if (!auth.currentUser) throw new Error('No authenticated user');
  
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      location,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}