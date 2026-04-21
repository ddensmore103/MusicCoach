import type { Song, Lesson, Feedback } from '@/types';

// ─── Mock Lessons ────────────────────────────────────────────────────────────

export const mockLesson: Lesson = {
  id: 'lesson-001',
  title: 'Practice Chord Changes',
  subtitle: 'Learn to switch smoothly between chords',
  imageUrl: '/images/robot-guitar.png',
};

// ─── Mock Songs ──────────────────────────────────────────────────────────────

export const mockSongs: Song[] = [
  {
    id: 'song-001',
    title: 'Evening Melody',
    subtitle: 'Vocal + Guitar',
    thumbnailUrl: '/images/song-thumb-1.png',
    timestamp: 'Yesterday',
  },
  {
    id: 'song-002',
    title: 'Sunrise Serenade',
    subtitle: 'Acoustic Guitar',
    thumbnailUrl: '/images/song-thumb-2.png',
    timestamp: '2 days ago',
  },
  {
    id: 'song-003',
    title: 'Late Night Jazz',
    subtitle: 'Piano + Vocal',
    thumbnailUrl: '/images/song-thumb-3.png',
    timestamp: '3 days ago',
  },
  {
    id: 'song-004',
    title: 'Morning Practice',
    subtitle: 'Guitar Solo',
    thumbnailUrl: '/images/song-thumb-4.png',
    timestamp: 'Last week',
  },
];

// ─── Mock Feedback (AI stub) ─────────────────────────────────────────────────

export const mockFeedback: Feedback = {
  strengths: [
    'Good rhythm consistency in the chorus',
    'Clean chord transitions between G and C',
    'Solid strumming pattern',
  ],
  weaknesses: [
    'Timing drifts slightly in the bridge section',
    'F chord fingering needs more pressure on the 1st string',
    'Tempo speeds up during transitions',
  ],
  practicePlan: [
    'Practice F to Am transition with metronome at 60 BPM for 5 minutes',
    'Record yourself playing the bridge section and compare timing',
    'Work on bar chord strength exercises for 10 minutes daily',
  ],
};
