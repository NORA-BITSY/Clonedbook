import { useDispatch } from 'react-redux';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { enqueue, setProgress, setStatus, remove } from '@/redux/features/uploadQueueSlice';

export function useUploadQueue() {
  const dispatch = useDispatch();
  const storage = getStorage();

  async function add(file: File, path: string, metadata?: Record<string, unknown>) {
    const action = enqueue({ file, path, metadata });
    dispatch(action);
    const id = (action as any).payload.id;

    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    dispatch(setStatus({ id, status: 'uploading' }));

    task.on('state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        dispatch(setProgress({ id, progress: pct }));
      },
      (err) => {
        dispatch(setStatus({ id, status: 'error', error: String(err) }));
      },
      async () => {
        dispatch(setStatus({ id, status: 'success' }));
        // Optionally dispatch follow-up (e.g., updateUserSetPictures)
        // dispatch(remove(id)) // if you want to auto-clear
      }
    );

    return { id, task };
  }

  return { add };
}