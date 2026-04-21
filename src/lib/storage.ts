import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload an audio blob to Firebase Storage.
 * Path: recordings/{userId}/{recordingId}.webm
 *
 * @returns The download URL of the uploaded file.
 */
export async function uploadAudioFile(
  userId: string,
  recordingId: string,
  blob: Blob
): Promise<string> {
  const storageRef = ref(storage, `recordings/${userId}/${recordingId}.webm`);

  await uploadBytes(storageRef, blob, {
    contentType: 'audio/webm',
  });

  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

/**
 * Get the download URL for an existing audio file.
 */
export async function getAudioUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}
