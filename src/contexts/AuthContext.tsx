'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/firestore';

// ─── Context Shape ───────────────────────────────────────────────────────────

interface AuthContextValue {
  /** The currently authenticated Firebase user, or null */
  user: User | null;
  /** True while the initial auth state is being resolved */
  loading: boolean;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Create a new account with email, password, and display name */
  signUp: (name: string, email: string, password: string) => Promise<void>;
  /** Sign in with Google popup */
  signInWithGoogle: () => Promise<void>;
  /** Sign out */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Set display name on the Firebase user
      await updateProfile(credential.user, { displayName: name });

      // Create user profile in Firestore
      await createUserProfile({
        id: credential.user.uid,
        name,
        email,
        profileImage: credential.user.photoURL ?? '',
      });
    },
    []
  );

  const signInWithGoogleFn = useCallback(async () => {
    const credential = await signInWithPopup(auth, googleProvider);

    // Ensure Firestore profile exists for Google users
    await createUserProfile({
      id: credential.user.uid,
      name: credential.user.displayName ?? '',
      email: credential.user.email ?? '',
      profileImage: credential.user.photoURL ?? '',
    });
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle: signInWithGoogleFn,
      signOut,
    }),
    [user, loading, signIn, signUp, signInWithGoogleFn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
