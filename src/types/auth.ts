export interface AuthUser extends User {
  isSuperAdmin?: boolean;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isSuperAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfile: () => Promise<void>;
}