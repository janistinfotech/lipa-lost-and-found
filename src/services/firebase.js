import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Lipa Lost & Found Firebase Web Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD2bfd_OmU80o2zeXP1BYyQIZjZyLY3Q4",
  authDomain: "lipa-lost-and-found.firebaseapp.com",
  projectId: "lipa-lost-and-found",
  storageBucket: "lipa-lost-and-found.firebasestorage.app",
  messagingSenderId: "278084117551",
  appId: "1:278084117551:web:e9050ce8d7235f333812da"
};

// Initialize Firebase App (singleton pattern)
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore
const db = getFirestore(app);

// Development-only Firebase initialization verification
if (import.meta.env.DEV) {
  if (app?.name) {
    console.log(`[Firebase] Firebase App initialized successfully (Project: ${firebaseConfig.projectId})`);
  }
  if (auth) {
    console.log('[Firebase] Firebase Authentication service initialized successfully');
  }
  if (db) {
    console.log('[Firebase] Cloud Firestore service initialized successfully');
  }
}

export { app, auth, db };
