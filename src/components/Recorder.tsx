'use client';

import { useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  SwitchCamera,
  X,
  AlertCircle,
} from 'lucide-react';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface RecorderProps {
  /** Called when user stops recording — receives blob + previewURL */
  onRecordingComplete: (blob: Blob, previewURL: string) => void;
  /** Called when user taps the close/back button */
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Recorder({ onRecordingComplete, onClose }: RecorderProps) {
  const {
    isRecording,
    duration,
    recordedBlob,
    previewURL,
    audioEnabled,
    videoEnabled,
    mediaStream,
    error,
    isInitializing,
    videoRef,
    initPreview,
    toggleAudio,
    toggleVideo,
    flipCamera,
    startRecording,
    stopRecording,
    cleanup,
  } = useVideoRecorder();

  // Initialize the camera preview on mount
  useEffect(() => {
    initPreview();
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When recording is complete, notify parent
  useEffect(() => {
    if (recordedBlob && previewURL) {
      onRecordingComplete(recordedBlob, previewURL);
    }
  }, [recordedBlob, previewURL, onRecordingComplete]);

  // ── Handle record press ────────────────────────────────────────────────

  const handleRecordPress = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // ── Permission Error UI ────────────────────────────────────────────────

  if (error && !mediaStream && !isRecording) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black px-6">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 mb-5">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Permission Required
          </h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            {error}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-all active:scale-95"
            >
              Go Back
            </button>
            <button
              onClick={initPreview}
              className="rounded-xl bg-brand-indigo px-6 py-3 text-sm font-medium text-white transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading / Initializing ─────────────────────────────────────────────

  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-white border-t-transparent" />
          <p className="text-sm text-gray-400">Starting camera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-3 pb-2">
        {/* Close Button */}
        <button
          onClick={() => {
            cleanup();
            onClose();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all active:scale-95"
          aria-label="Close recorder"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Recording Timer */}
        {isRecording && (
          <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-sm px-4 py-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-white tabular-nums">
              {formatDuration(duration)}
            </span>
          </div>
        )}

        {/* Spacer for layout balance when not recording */}
        {!isRecording && <div className="w-10" />}
      </div>

      {/* ── Camera Preview ──────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`absolute inset-0 h-full w-full object-cover ${
            !videoEnabled && !isRecording ? 'opacity-0' : ''
          }`}
        />

        {/* Overlay when video is disabled */}
        {!videoEnabled && !isRecording && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <VideoOff className="h-12 w-12 text-gray-600 mb-3" />
            <p className="text-sm text-gray-500">Video is off</p>
          </div>
        )}

        {/* Recording error overlay */}
        {error && (isRecording || mediaStream) && (
          <div className="absolute bottom-20 left-4 right-4">
            <div className="rounded-xl bg-red-500/90 backdrop-blur-sm px-4 py-3 text-sm text-white text-center">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Controls ─────────────────────────────────────────────── */}
      <div
        className="relative z-10 bg-black/60 backdrop-blur-md"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}
      >
        <div className="flex items-center justify-around px-6 py-4">
          {/* Left Controls: Audio + Video Toggles */}
          <div className="flex items-center gap-4">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              disabled={isRecording}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95 ${
                audioEnabled
                  ? 'bg-white/15'
                  : 'bg-red-500/20'
              } ${isRecording ? 'opacity-40' : ''}`}
              aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
            >
              {audioEnabled ? (
                <Mic className="h-5 w-5 text-white" />
              ) : (
                <MicOff className="h-5 w-5 text-red-400" />
              )}
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              disabled={isRecording}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95 ${
                videoEnabled
                  ? 'bg-white/15'
                  : 'bg-red-500/20'
              } ${isRecording ? 'opacity-40' : ''}`}
              aria-label={videoEnabled ? 'Turn off video' : 'Turn on video'}
            >
              {videoEnabled ? (
                <Video className="h-5 w-5 text-white" />
              ) : (
                <VideoOff className="h-5 w-5 text-red-400" />
              )}
            </button>
          </div>

          {/* Center: Record Button */}
          <button
            onClick={handleRecordPress}
            className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full transition-all active:scale-95"
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-white" />

            {/* Inner circle / square */}
            {isRecording ? (
              <div className="h-7 w-7 rounded-md bg-red-500 transition-all" />
            ) : (
              <div className="h-[58px] w-[58px] rounded-full bg-red-500 transition-all" />
            )}
          </button>

          {/* Right: Flip Camera */}
          <div className="flex items-center">
            <button
              onClick={flipCamera}
              disabled={isRecording}
              className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/15 transition-all active:scale-95 ${
                isRecording ? 'opacity-40' : ''
              }`}
              aria-label="Flip camera"
            >
              <SwitchCamera className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
