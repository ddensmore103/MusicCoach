'use client';

import { Mic } from 'lucide-react';

interface RecordButtonProps {
  isRecording?: boolean;
  onClick?: () => void;
}

export function RecordButton({ isRecording = false, onClick }: RecordButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex h-14 w-14 items-center justify-center rounded-full
        bg-brand-red text-white shadow-record
        transition-all active:scale-95
        ${isRecording ? 'animate-pulse-record' : 'hover:bg-brand-red-dark'}
      `}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        /* Stop icon (rounded square) */
        <div className="h-5 w-5 rounded-sm bg-white" />
      ) : (
        <Mic className="h-6 w-6" />
      )}

      {/* Pulse ring when recording */}
      {isRecording && (
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-red/30" />
      )}
    </button>
  );
}
