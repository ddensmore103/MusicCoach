'use client';

import { useCallback, useState } from 'react';
import { Mic, Square, Upload, RotateCcw } from 'lucide-react';
import { useRecorder } from '@/hooks/useRecorder';
import { useAuth } from '@/contexts/AuthContext';
import { uploadAudioFile } from '@/lib/storage';
import { saveRecordingMetadata } from '@/lib/firestore';

/**
 * Format seconds into MM:SS display.
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function RecordPage() {
  const { user } = useAuth();
  const {
    isRecording,
    duration,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecorder();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleSave = useCallback(async () => {
    if (!audioBlob || !user) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const recordingId = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      // Upload to Firebase Storage
      const audioUrl = await uploadAudioFile(user.uid, recordingId, audioBlob);

      // Save metadata to Firestore
      await saveRecordingMetadata({
        id: recordingId,
        userId: user.uid,
        audioUrl,
        duration,
      });

      setUploadSuccess(true);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Failed to save recording'
      );
    } finally {
      setIsUploading(false);
    }
  }, [audioBlob, user, duration]);

  const handleNewRecording = useCallback(() => {
    resetRecording();
    setUploadSuccess(false);
    setUploadError('');
  }, [resetRecording]);

  return (
    <div className="flex flex-col items-center px-6 pt-12">
      <h1 className="text-xl font-bold text-text-primary mb-2">
        Record Your Practice
      </h1>
      <p className="text-sm text-text-secondary mb-10">
        Tap the button to start recording
      </p>

      {/* Timer Display */}
      <div className="mb-10">
        <span
          className={`text-5xl font-light tabular-nums tracking-wider ${
            isRecording ? 'text-brand-red' : 'text-text-primary'
          }`}
        >
          {formatDuration(duration)}
        </span>
      </div>

      {/* Recording Visualizer (simple) */}
      {isRecording && (
        <div className="mb-8 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-brand-red animate-pulse"
              style={{
                height: `${20 + Math.random() * 20}px`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Action Button */}
      {!audioBlob && (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex h-20 w-20 items-center justify-center rounded-full transition-all active:scale-95 ${
            isRecording
              ? 'bg-text-primary shadow-lg'
              : 'bg-brand-red shadow-record hover:bg-brand-red-dark'
          }`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <Square className="h-7 w-7 text-white fill-white" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </button>
      )}

      {/* Post-Recording Actions */}
      {audioBlob && !uploadSuccess && (
        <div className="flex items-center gap-6">
          <button
            onClick={handleNewRecording}
            className="flex flex-col items-center gap-1"
            aria-label="Discard and record again"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-tertiary">
              <RotateCcw className="h-5 w-5 text-text-secondary" />
            </div>
            <span className="text-xs text-text-secondary">Redo</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isUploading}
            className="flex flex-col items-center gap-1"
            aria-label="Save recording"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-indigo shadow-md">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs text-brand-indigo font-medium">
              {isUploading ? 'Saving...' : 'Save'}
            </span>
          </button>
        </div>
      )}

      {/* Upload Success */}
      {uploadSuccess && (
        <div className="text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-primary mb-1">
            Recording Saved!
          </p>
          <p className="text-xs text-text-secondary mb-6">
            Duration: {formatDuration(duration)}
          </p>
          <button
            onClick={handleNewRecording}
            className="rounded-xl bg-brand-indigo px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-purple active:scale-95"
          >
            Record Another
          </button>
        </div>
      )}

      {/* Error Messages */}
      {(error || uploadError) && (
        <div className="mt-6 w-full rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || uploadError}
        </div>
      )}
    </div>
  );
}
