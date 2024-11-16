import { initializeFirebaseRules, verifySuperAdmin } from './initializeFirebase.js';

async function setupFirebase() {
  try {
    // Initialize rules and base configuration
    await initializeFirebaseRules();
    
    // Verify super admin exists
    await verifySuperAdmin('ollie@tri-alliance.com.au');
    
    console.log('Firebase setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Firebase setup failed:', error);
    process.exit(1);
  }
}

setupFirebase();