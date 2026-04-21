'use client';

import Image from 'next/image';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  notificationCount?: number;
}

export function Header({ notificationCount = 1 }: HeaderProps) {
  const { user } = useAuth();

  const profileImage = user?.photoURL ?? '';
  const initials = (user?.displayName ?? user?.email ?? '?')[0].toUpperCase();

  return (
    <header className="flex items-center justify-between px-5 py-3">
      {/* Profile Image */}
      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-brand-indigo/10">
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile"
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-indigo">
            {initials}
          </div>
        )}
      </div>

      {/* App Name */}
      <h1 className="text-lg font-bold text-text-primary tracking-tight">
        MusicCoach
      </h1>

      {/* Notification Bell */}
      <button
        className="relative p-2 rounded-full hover:bg-surface-tertiary transition-colors"
        aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5 text-text-secondary" />
        {notificationCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>
    </header>
  );
}
