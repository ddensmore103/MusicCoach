// ─── User ────────────────────────────────────────────────────────────────────

export interface AppUser {
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

// ─── Recording ───────────────────────────────────────────────────────────────

export interface Recording {
  id: string;
  userId: string;
  audioUrl: string;
  createdAt: Date;
  duration: number; // seconds
}

/** Firestore-serializable version (Dates become Timestamps) */
export interface RecordingDoc {
  id: string;
  userId: string;
  audioUrl: string;
  createdAt: FirebaseTimestamp;
  duration: number;
}

/** Minimal representation of Firestore Timestamp for type safety */
interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

// ─── AI Feedback (mock for now) ──────────────────────────────────────────────

export interface Feedback {
  strengths: string[];
  weaknesses: string[];
  practicePlan: string[];
}

// ─── Song ────────────────────────────────────────────────────────────────────

export interface Song {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string;
  timestamp: string;
}

// ─── Lesson ──────────────────────────────────────────────────────────────────

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

// ─── Notification ────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// ─── Recorder State ─────────────────────────────────────────────────────────

export interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  error: string | null;
}
