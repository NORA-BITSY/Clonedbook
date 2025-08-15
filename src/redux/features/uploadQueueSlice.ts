import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export type UploadItem = {
  id: string;
  file: File;
  path: string;             // storage path
  status: 'queued'|'uploading'|'success'|'error'|'canceled';
  progress: number;         // 0..100
  error?: string;
  metadata?: Record<string, unknown>;
};

type State = { items: UploadItem[] };
const initial: State = { items: [] };

const slice = createSlice({
  name: 'uploadQueue',
  initialState: initial,
  reducers: {
    enqueue(state, action: PayloadAction<Omit<UploadItem, 'id'|'status'|'progress'>>) {
      state.items.push({ id: nanoid(), status: 'queued', progress: 0, ...action.payload });
    },
    setProgress(state, action: PayloadAction<{id:string;progress:number}>) {
      const it = state.items.find(i => i.id === action.payload.id); 
      if (it) it.progress = action.payload.progress;
    },
    setStatus(state, action: PayloadAction<{id:string;status:UploadItem['status'];error?:string}>) {
      const it = state.items.find(i => i.id === action.payload.id); 
      if (it) { 
        it.status = action.payload.status; 
        it.error = action.payload.error; 
      }
    },
    remove(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    }
  }
});

export const { enqueue, setProgress, setStatus, remove } = slice.actions;
export default slice.reducer;