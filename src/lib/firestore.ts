import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { AppUser, Recording } from '@/types';

// ─── User Profile ────────────────────────────────────────────────────────────

const USERS_COLLECTION = 'users';

/**
 * Create or update a user profile document in Firestore.
 * Uses merge to avoid overwriting existing fields on subsequent logins.
 */
export async function createUserProfile(user: AppUser): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, user.id);
  await setDoc(
    userRef,
    {
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Fetch a user profile by UID.
 * Returns null if the profile doesn't exist.
 */
export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name ?? '',
    email: data.email ?? '',
    profileImage: data.profileImage ?? '',
  };
}

// ─── Recordings ──────────────────────────────────────────────────────────────

const RECORDINGS_COLLECTION = 'recordings';

/**
 * Save recording metadata to Firestore.
 */
export async function saveRecordingMetadata(
  recording: Omit<Recording, 'createdAt'> & { createdAt?: Date }
): Promise<void> {
  const recordingRef = doc(db, RECORDINGS_COLLECTION, recording.id);
  await setDoc(recordingRef, {
    userId: recording.userId,
    audioUrl: recording.audioUrl,
    duration: recording.duration,
    createdAt: serverTimestamp(),
  });
}

/**
 * Fetch all recordings for a user, ordered by most recent first.
 */
export async function getUserRecordings(userId: string): Promise<Recording[]> {
  const recordingsRef = collection(db, RECORDINGS_COLLECTION);
  const q = query(
    recordingsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId,
      audioUrl: data.audioUrl,
      duration: data.duration,
      createdAt: data.createdAt?.toDate() ?? new Date(),
    };
  });
}
