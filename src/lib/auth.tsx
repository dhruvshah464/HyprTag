import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface UserProfile {
  isElite: boolean;
  onboarded: boolean;
  demoCompleted: boolean;
  displayName?: string;
  niche?: string;
  connections?: Record<string, boolean>;
  socialHandles?: Record<string, string>;
  linkedPlatforms?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isElite: boolean;
  onboarded: boolean;
  demoCompleted: boolean;
  profile: UserProfile | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  upgradeToElite: () => Promise<void>;
  completeOnboarding: (details: Partial<UserProfile>) => Promise<void>;
  setDemoCompleted: (completed: boolean) => Promise<void>;
  isLoggingIn: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isElite, setIsElite] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [demoCompleted, setDemoCompletedState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let unsubFirestore: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Subscribe to user document for Elite status and onboarding
        const userRef = doc(db, 'users', authUser.uid);
        unsubFirestore = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfile(data);
            setIsElite(data.isElite || false);
            setOnboarded(data.onboarded || false);
            setDemoCompletedState(data.demoCompleted || false);
          } else {
            // Initialize user doc if it doesn't exist
            const initialProfile: UserProfile = {
              isElite: false,
              onboarded: false,
              demoCompleted: false,
              displayName: authUser.displayName || '',
              connections: {},
              linkedPlatforms: [] // Reset simulation
            };
            setDoc(userRef, {
              ...initialProfile,
              email: authUser.email,
              createdAt: new Date().toISOString()
            }).catch(e => console.error("Error creating user doc", e));
            
            setProfile(initialProfile);
            setIsElite(false);
            setOnboarded(false);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore user snapshot error:", error);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setIsElite(false);
        setOnboarded(false);
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
      // login successful
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.code === 'auth/popup-blocked') {
        setAuthError("Popup blocked by browser. Please enable popups or try opening HyprTags in a new tab.");
      } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
        setAuthError("Security policy conflict. Please open HyprTags in a NEW TAB to complete secure authentication.");
      } else {
        setAuthError(error.message || "Failed to initialize secure session.");
      }
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
    // Client-side upgrade is now blocked by security rules. 
    // This function will be called AFTER the server-side verification updates the user document.
    // We just need to trigger a profile refresh which onSnapshot will handle.
    console.log("Strategic Upgrade Synchronization Requested. Awaiting neural confirmation from server.");
  };

  const completeOnboarding = async (details: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { ...details, onboarded: true }, { merge: true });
  };

  const setDemoCompleted = async (completed: boolean) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { demoCompleted: completed }, { merge: true });
  };

  const value = useMemo(() => ({ 
    user, 
    loading, 
    isElite, 
    onboarded, 
    demoCompleted,
    profile,
    login, 
    logout, 
    upgradeToElite, 
    completeOnboarding,
    setDemoCompleted,
    isLoggingIn, 
    authError 
  }), [user, loading, isElite, onboarded, demoCompleted, profile, isLoggingIn, authError]);

  return (
    <AuthContext.Provider value={value}>
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
