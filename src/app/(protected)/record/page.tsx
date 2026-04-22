'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Recorder } from '@/components/Recorder';

/**
 * Record page — fullscreen camera recorder.
 *
 * On recording complete, stores the blob + preview URL in sessionStorage
 * (as a temporary bridge to the review page) and navigates to /review.
 *
 * sessionStorage is used instead of React context because navigating
 * between routes in Next.js App Router remounts components.
 */
export default function RecordPage() {
  const router = useRouter();

  const handleRecordingComplete = useCallback(
    (blob: Blob, previewURL: string) => {
      // Store blob as base64 in sessionStorage for the review page
      // This is a temporary local-only solution — no Firebase upload yet
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          try {
            sessionStorage.setItem('recording_data', reader.result);
            sessionStorage.setItem('recording_type', blob.type);
            sessionStorage.setItem('recording_preview', previewURL);
            router.push('/review');
          } catch {
            // sessionStorage might be full / unavailable
            // fallback: navigate with the object URL only
            sessionStorage.setItem('recording_preview', previewURL);
            router.push('/review');
          }
        }
      };
      reader.readAsDataURL(blob);
    },
    [router]
  );

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Recorder
      onRecordingComplete={handleRecordingComplete}
      onClose={handleClose}
    />
  );
}
