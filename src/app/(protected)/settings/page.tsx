'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, ChevronRight, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}

function SettingsItem({ icon: Icon, label, onClick }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 transition-colors hover:bg-surface-tertiary active:bg-surface-tertiary"
    >
      <Icon className="h-5 w-5 text-text-secondary" />
      <span className="flex-1 text-left text-sm font-medium text-text-primary">
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-text-tertiary" />
    </button>
  );
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/login');
  }, [signOut, router]);

  const profileImage = user?.photoURL ?? '';
  const displayName = user?.displayName ?? 'User';
  const email = user?.email ?? '';

  return (
    <div className="px-5 pt-8">
      <h1 className="text-xl font-bold text-text-primary mb-6">Settings</h1>

      {/* Profile Card */}
      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card mb-6">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-brand-indigo/10">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-brand-indigo">
              {displayName[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-text-primary truncate">
            {displayName}
          </h2>
          <p className="text-sm text-text-secondary truncate">{email}</p>
        </div>
      </div>

      {/* Settings List */}
      <div className="rounded-2xl bg-white shadow-card overflow-hidden mb-6">
        <SettingsItem icon={User} label="Edit Profile" />
        <SettingsItem icon={Bell} label="Notifications" />
        <SettingsItem icon={Shield} label="Privacy & Security" />
        <SettingsItem icon={HelpCircle} label="Help & Support" />
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-[0.98]"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>

      {/* App Version */}
      <p className="mt-6 text-center text-xs text-text-tertiary">
        MusicCoach v0.1.0
      </p>
    </div>
  );
}
