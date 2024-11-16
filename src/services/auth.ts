import { 
  getAuth, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  type User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export class AuthService {
  async signIn(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      
      // Create/update user document
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      }, { merge: true });

      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName,
        createdAt: new Date().toISOString()
      });

      // Send verification email
      await sendEmailVerification(user);

      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async checkSuperAdmin(email: string): Promise<boolean> {
    try {
      const rolesRef = doc(db, 'system', 'role');
      const rolesSnap = await getDoc(rolesRef);
      
      if (rolesSnap.exists()) {
        const { superAdmins } = rolesSnap.data();
        return superAdmins?.includes(email) || false;
      }
      return false;
    } catch (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
  }

  private handleAuthError(error: any): Error {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'Operation not allowed.',
      'auth/weak-password': 'Password is too weak.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.'
    };

    return new Error(errorMessages[error.code] || error.message);
  }
}

export const authService = new AuthService();