'use client';

import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { LessonCard } from '@/components/LessonCard';
import { SongList } from '@/components/SongList';
import { mockLesson, mockSongs } from '@/data/mock';

export default function HomePage() {
  return (
    <div className="pb-4">
      {/* Top Header */}
      <Header notificationCount={1} />

      {/* Search */}
      <SearchBar placeholder="Search..." />

      {/* Your Lesson Section */}
      <LessonCard lesson={mockLesson} />

      {/* Recent Songs Section */}
      <div className="mt-2">
        <SongList songs={mockSongs} />
      </div>
    </div>
  );
}
