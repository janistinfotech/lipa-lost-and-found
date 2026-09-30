import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or sync user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile(data);
        return data;
      }
    } catch (err) {
      console.warn('[AuthContext] Could not fetch Firestore user profile:', err);
    }
    return null;
  };

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserProfile(user.uid);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up new user with Email/Password & create Firestore profile document
  const signup = async (fullName, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // 1. Update Firebase Auth displayName
    await updateProfile(user, {
      displayName: fullName.trim()
    });

    // 2. Create Firestore User Profile document at users/{uid}
    const profileData = {
      uid: user.uid,
      fullName: fullName.trim(),
      email: user.email.toLowerCase(),
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profileData);
      setUserProfile(profileData);
    } catch (firestoreError) {
      console.error('[AuthContext] Error creating Firestore user document:', firestoreError);
      // We don't fail the registration if firestore permissions delay, but keep local state
      setUserProfile(profileData);
    }

    // Refresh current user reference with new displayName
    setCurrentUser({ ...user, displayName: fullName.trim() });
    return user;
  };

  // Login existing user
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    setCurrentUser(user);
    await fetchUserProfile(user.uid);
    return user;
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
