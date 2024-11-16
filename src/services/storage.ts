import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, storage, db } from '../config/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';

const AVATAR_OPTIONS = {
  maxSizeMB: 0.1, // Reduce max size to 100KB
  maxWidthOrHeight: 400,
  useWebWorker: true,
  fileType: 'image/jpeg',
  initialQuality: 0.8
};

const COVER_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg',
  initialQuality: 0.8
};

export async function uploadProfileImage(
  file: Blob,
  type: 'avatar' | 'cover'
): Promise<string> {
  if (!auth.currentUser) throw new Error('No authenticated user');

  try {
    // Compress image with optimized settings
    const options = type === 'avatar' ? AVATAR_OPTIONS : COVER_OPTIONS;
    const compressedFile = await imageCompression(file as File, options);

    // Create unique filename with timestamp and user ID
    const timestamp = Date.now();
    const filename = `${type}_${timestamp}.jpg`;
    const path = `users/${auth.currentUser.uid}/${type}/${filename}`;
    
    // Upload new file
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, compressedFile, {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000' // Cache for 1 year
    });

    // Get download URL with caching enabled
    const downloadUrl = await getDownloadURL(snapshot.ref);

    // Get user document reference
    const userRef = doc(db, 'users', auth.currentUser.uid);

    // Delete old image if it exists (for avatar only)
    if (type === 'avatar' && auth.currentUser.photoURL) {
      try {
        const oldUrl = new URL(auth.currentUser.photoURL);
        if (oldUrl.hostname.includes('firebasestorage')) {
          const oldRef = ref(storage, oldUrl.pathname);
          await deleteObject(oldRef).catch(() => {
            console.log('No old avatar to delete or error deleting');
          });
        }
      } catch (error) {
        console.log('Error parsing old avatar URL:', error);
      }
    }

    // Update both auth profile and Firestore document in parallel
    await Promise.all([
      type === 'avatar' ? updateProfile(auth.currentUser, { photoURL: downloadUrl }) : Promise.resolve(),
      updateDoc(userRef, {
        ...(type === 'avatar' ? { photoURL: downloadUrl } : { coverPhotoURL: downloadUrl }),
        updatedAt: new Date().toISOString()
      })
    ]);

    return downloadUrl;
  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    throw new Error(`Failed to upload ${type} image. Please try again.`);
  }
}