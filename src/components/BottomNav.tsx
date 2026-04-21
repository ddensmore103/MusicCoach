'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, ListChecks, Bookmark, Settings } from 'lucide-react';
import { RecordButton } from './RecordButton';
import { useRecorder } from '@/hooks/useRecorder';
import { useCallback } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/home' },
  { id: 'todo', label: 'To-Do', icon: ListChecks, path: '/todo' },
  // Record button is rendered separately in the center
  { id: 'saved', label: 'Saved', icon: Bookmark, path: '/saved' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isRecording, startRecording, stopRecording } = useRecorder();

  const handleRecordPress = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-nav"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pt-1.5 pb-1.5">
        {/* Left nav items */}
        {leftItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className="flex flex-1 flex-col items-center gap-0.5 py-1"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-brand-indigo' : 'text-text-tertiary'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-brand-indigo' : 'text-text-tertiary'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Center Record Button (elevated) */}
        <div className="flex flex-1 items-center justify-center -mt-5">
          <RecordButton
            isRecording={isRecording}
            onClick={handleRecordPress}
          />
        </div>

        {/* Right nav items */}
        {rightItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className="flex flex-1 flex-col items-center gap-0.5 py-1"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-brand-indigo' : 'text-text-tertiary'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-brand-indigo' : 'text-text-tertiary'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
