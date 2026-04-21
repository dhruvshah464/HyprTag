import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isElite: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  upgradeToElite: () => Promise<void>;
  isLoggingIn: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isElite, setIsElite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let unsubFirestore: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Subscribe to user document for Elite status
        const userRef = doc(db, 'users', authUser.uid);
        unsubFirestore = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setIsElite(docSnap.data().isElite || false);
          } else {
            // Initialize user doc if it doesn't exist
            setDoc(userRef, {
              email: authUser.email,
              displayName: authUser.displayName,
              isElite: false,
              createdAt: new Date().toISOString()
            }).catch(e => console.error("Error creating user doc", e));
            setIsElite(false);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore user snapshot error:", error);
          // Still set loading to false so the app can render (maybe in a limited state)
          setLoading(false);
        });
      } else {
        setIsElite(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  const login = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login Error:", error);
      setAuthError(error.message || "Failed to initialize secure session.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  const upgradeToElite = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { isElite: true }, { merge: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, isElite, login, logout, upgradeToElite, isLoggingIn, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
