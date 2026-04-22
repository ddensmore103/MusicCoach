'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type RefObject,
} from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type FacingMode = 'user' | 'environment';

export interface VideoRecorderState {
  /** Whether we are actively recording */
  isRecording: boolean;
  /** Duration in seconds since recording started */
  duration: number;
  /** The finished recording blob (video/webm) */
  recordedBlob: Blob | null;
  /** Object URL for playback of the recorded blob */
  previewURL: string | null;
  /** Whether audio track is enabled for next recording */
  audioEnabled: boolean;
  /** Whether video track is enabled for next recording */
  videoEnabled: boolean;
  /** Current camera facing mode */
  facingMode: FacingMode;
  /** Active media stream for the camera preview */
  mediaStream: MediaStream | null;
  /** User-facing error message, or null */
  error: string | null;
  /** Whether the preview stream is initializing */
  isInitializing: boolean;
}

export interface UseVideoRecorderReturn extends VideoRecorderState {
  /** Ref to attach to the <video> element for live preview */
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Initialize camera preview stream */
  initPreview: () => Promise<void>;
  /** Toggle audio on/off (affects next recording) */
  toggleAudio: () => void;
  /** Toggle video on/off (affects next recording) */
  toggleVideo: () => void;
  /** Flip between front and back camera */
  flipCamera: () => Promise<void>;
  /** Start recording with current toggle/facing settings */
  startRecording: () => Promise<void>;
  /** Stop recording and produce the blob */
  stopRecording: () => void;
  /** Clear the recorded blob and reset for re-recording */
  reset: () => void;
  /** Clean up all streams and state */
  cleanup: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSupportedMimeType(): string {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return 'video/webm';
}

function getPermissionErrorMessage(err: unknown): string {
  if (err instanceof DOMException) {
    switch (err.name) {
      case 'NotAllowedError':
        return 'Camera/microphone permission denied. Please allow access in your browser settings.';
      case 'NotFoundError':
        return 'No camera or microphone found on this device.';
      case 'NotReadableError':
        return 'Camera or microphone is already in use by another app.';
      case 'OverconstrainedError':
        return 'Camera does not support requested settings. Try flipping the camera.';
      default:
        return `Could not access media devices: ${err.message}`;
    }
  }
  return 'An unexpected error occurred while accessing camera.';
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useVideoRecorder(): UseVideoRecorderReturn {
  const [state, setState] = useState<VideoRecorderState>({
    isRecording: false,
    duration: 0,
    recordedBlob: null,
    previewURL: null,
    audioEnabled: true,
    videoEnabled: true,
    facingMode: 'user',
    mediaStream: null,
    error: null,
    isInitializing: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── Stop all tracks on a stream ──────────────────────────────────────────

  const stopStream = useCallback((stream: MediaStream | null) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }, []);

  // ── Cleanup everything ───────────────────────────────────────────────────

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Already stopped
      }
    }
    mediaRecorderRef.current = null;

    stopStream(streamRef.current);
    streamRef.current = null;

    // Revoke any existing preview URL
    setState((prev) => {
      if (prev.previewURL) {
        URL.revokeObjectURL(prev.previewURL);
      }
      return {
        ...prev,
        isRecording: false,
        mediaStream: null,
        previewURL: null,
        recordedBlob: null,
        duration: 0,
        error: null,
        isInitializing: false,
      };
    });
  }, [stopStream]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopStream(streamRef.current);
      // Revoke blob URL if it exists
      setState((prev) => {
        if (prev.previewURL) URL.revokeObjectURL(prev.previewURL);
        return prev;
      });
    };
  }, [stopStream]);

  // ── Get a stream with given constraints ──────────────────────────────────

  const getStream = useCallback(
    async (
      video: boolean,
      audio: boolean,
      facing: FacingMode
    ): Promise<MediaStream> => {
      const constraints: MediaStreamConstraints = {
        audio: audio
          ? { echoCancellation: true, noiseSuppression: true }
          : false,
        video: video ? { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      };

      // At least one track is required
      if (!audio && !video) {
        constraints.audio = true;
      }

      return navigator.mediaDevices.getUserMedia(constraints);
    },
    []
  );

  // ── Initialize camera preview ────────────────────────────────────────────

  const initPreview = useCallback(async () => {
    setState((prev) => ({ ...prev, isInitializing: true, error: null }));

    try {
      // Stop any existing preview stream
      stopStream(streamRef.current);

      const stream = await getStream(true, true, state.facingMode);
      streamRef.current = stream;

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setState((prev) => ({
        ...prev,
        mediaStream: stream,
        isInitializing: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isInitializing: false,
        error: getPermissionErrorMessage(err),
      }));
    }
  }, [state.facingMode, getStream, stopStream]);

  // ── Toggle audio ─────────────────────────────────────────────────────────

  const toggleAudio = useCallback(() => {
    setState((prev) => ({ ...prev, audioEnabled: !prev.audioEnabled }));
  }, []);

  // ── Toggle video ─────────────────────────────────────────────────────────

  const toggleVideo = useCallback(() => {
    setState((prev) => ({ ...prev, videoEnabled: !prev.videoEnabled }));
  }, []);

  // ── Flip camera ──────────────────────────────────────────────────────────

  const flipCamera = useCallback(async () => {
    const newFacing: FacingMode =
      state.facingMode === 'user' ? 'environment' : 'user';

    try {
      // Stop current preview stream
      stopStream(streamRef.current);

      const stream = await getStream(true, true, newFacing);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setState((prev) => ({
        ...prev,
        facingMode: newFacing,
        mediaStream: stream,
        error: null,
      }));
    } catch {
      // If the new facing mode isn't available, stay on current
      // Re-init with original facing
      try {
        const stream = await getStream(true, true, state.facingMode);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setState((prev) => ({ ...prev, mediaStream: stream }));
      } catch {
        // Can't recover — do nothing
      }
    }
  }, [state.facingMode, getStream, stopStream]);

  // ── Start recording ──────────────────────────────────────────────────────

  const startRecording = useCallback(async () => {
    try {
      chunksRef.current = [];
      setState((prev) => ({
        ...prev,
        isRecording: false,
        duration: 0,
        recordedBlob: null,
        error: null,
      }));

      // Revoke previous preview URL
      if (state.previewURL) {
        URL.revokeObjectURL(state.previewURL);
      }

      // Stop the preview stream — we'll create a new one with recording constraints
      stopStream(streamRef.current);

      const stream = await getStream(
        state.videoEnabled,
        state.audioEnabled,
        state.facingMode
      );
      streamRef.current = stream;

      // Attach the new stream to the video element for live preview during recording
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);

        // Stop all tracks to release camera/mic
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        setState((prev) => ({
          ...prev,
          isRecording: false,
          recordedBlob: blob,
          previewURL: url,
          mediaStream: null,
        }));
      };

      mediaRecorder.onerror = () => {
        setState((prev) => ({
          ...prev,
          isRecording: false,
          error: 'Recording failed. Please try again.',
        }));
      };

      // Start recording with 1-second timeslice
      mediaRecorder.start(1000);

      // Duration timer
      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

      setState((prev) => ({
        ...prev,
        isRecording: true,
        mediaStream: stream,
        previewURL: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: getPermissionErrorMessage(err),
      }));
    }
  }, [state.audioEnabled, state.videoEnabled, state.facingMode, state.previewURL, getStream, stopStream]);

  // ── Stop recording ───────────────────────────────────────────────────────

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── Reset (for re-recording) ─────────────────────────────────────────────

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    chunksRef.current = [];

    setState((prev) => {
      if (prev.previewURL) {
        URL.revokeObjectURL(prev.previewURL);
      }
      return {
        ...prev,
        isRecording: false,
        duration: 0,
        recordedBlob: null,
        previewURL: null,
        error: null,
      };
    });
  }, []);

  return {
    ...state,
    videoRef,
    initPreview,
    toggleAudio,
    toggleVideo,
    flipCamera,
    startRecording,
    stopRecording,
    reset,
    cleanup,
  };
}
