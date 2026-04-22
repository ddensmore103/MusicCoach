'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, Check, AlertCircle } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ReviewState {
  previewURL: string | null;
  blob: Blob | null;
  isLoading: boolean;
  isSaved: boolean;
  error: string | null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const router = useRouter();

  const [state, setState] = useState<ReviewState>({
    previewURL: null,
    blob: null,
    isLoading: true,
    isSaved: false,
    error: null,
  });

  // ── Load recording from sessionStorage (set by record page) ────────────

  useEffect(() => {
    try {
      const dataUrl = sessionStorage.getItem('recording_data');
      const type = sessionStorage.getItem('recording_type') || 'video/webm';
      const fallbackPreview = sessionStorage.getItem('recording_preview');

      if (dataUrl) {
        // Convert base64 data URL back to blob
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString || type });
        const url = URL.createObjectURL(blob);

        setState({
          previewURL: url,
          blob,
          isLoading: false,
          isSaved: false,
          error: null,
        });
      } else if (fallbackPreview) {
        // Object URL was preserved — use it directly (same session only)
        setState({
          previewURL: fallbackPreview,
          blob: null,
          isLoading: false,
          isSaved: false,
          error: null,
        });
      } else {
        // No recording data found — redirect back
        router.replace('/record');
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load recording. Please try again.',
      }));
    }

    // Cleanup object URLs on unmount
    return () => {
      setState((prev) => {
        if (prev.previewURL) {
          URL.revokeObjectURL(prev.previewURL);
        }
        return prev;
      });
    };
  }, [router]);

  // ── Re-record ──────────────────────────────────────────────────────────

  const handleReRecord = useCallback(() => {
    // Clean up session storage
    sessionStorage.removeItem('recording_data');
    sessionStorage.removeItem('recording_type');
    sessionStorage.removeItem('recording_preview');

    // Revoke URL
    if (state.previewURL) {
      URL.revokeObjectURL(state.previewURL);
    }

    router.replace('/record');
  }, [state.previewURL, router]);

  // ── Save (local state only for now) ────────────────────────────────────

  const handleSave = useCallback(() => {
    // For now: store in sessionStorage as "saved"
    // This is the hook point for future Firebase upload
    setState((prev) => ({ ...prev, isSaved: true }));

    // Clean up sessionStorage recording data after "saving"
    // The blob is now considered handled
    sessionStorage.removeItem('recording_data');
    sessionStorage.removeItem('recording_type');
    sessionStorage.removeItem('recording_preview');
  }, []);

  // ── Navigate home after save ───────────────────────────────────────────

  const handleGoHome = useCallback(() => {
    if (state.previewURL) {
      URL.revokeObjectURL(state.previewURL);
    }
    router.push('/home');
  }, [state.previewURL, router]);

  // ── Loading ────────────────────────────────────────────────────────────

  if (state.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-white border-t-transparent" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────

  if (state.error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-sm text-gray-400 text-center mb-6">{state.error}</p>
        <button
          onClick={() => router.replace('/record')}
          className="rounded-xl bg-brand-indigo px-6 py-3 text-sm font-medium text-white active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Saved confirmation ─────────────────────────────────────────────────

  if (state.isSaved) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 mb-5">
          <Check className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Recording Saved!</h2>
        <p className="text-sm text-gray-400 text-center mb-8">
          Your recording has been saved. Firebase upload will be enabled soon.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleReRecord}
            className="rounded-xl bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-all active:scale-95"
          >
            Record Another
          </button>
          <button
            onClick={handleGoHome}
            className="rounded-xl bg-brand-indigo px-6 py-3 text-sm font-medium text-white transition-all active:scale-95"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ── Review playback ────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-center px-4 pt-4 pb-2">
        <h1 className="text-lg font-semibold text-white">Review Recording</h1>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center px-4">
        {state.previewURL ? (
          <video
            src={state.previewURL}
            controls
            playsInline
            className="w-full max-h-[65vh] rounded-2xl bg-gray-900 object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-64 w-full rounded-2xl bg-gray-900">
            <p className="text-sm text-gray-500">No preview available</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div
        className="px-6 pt-4 pb-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 16px)' }}
      >
        <div className="flex gap-3">
          {/* Re-record */}
          <button
            onClick={handleReRecord}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-800 py-4 text-sm font-semibold text-white transition-all active:scale-[0.98]"
          >
            <RotateCcw className="h-5 w-5" />
            Re-record
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-indigo py-4 text-sm font-semibold text-white transition-all active:scale-[0.98]"
          >
            <Check className="h-5 w-5" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
