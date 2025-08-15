import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UploadQueueItem {
  id: string;
  file?: File;
  status: 'uploading' | 'completed' | 'error' | 'canceled';
  progress?: number;
}

interface UploadQueueState {
  items: UploadQueueItem[];
}

const initialState: UploadQueueState = {
  items: [],
};

const uploadQueueSlice = createSlice({
  name: 'uploadQueue',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<UploadQueueItem>) => {
      state.items.push(action.payload);
    },
    remove: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setStatus: (state, action: PayloadAction<{ id: string; status: UploadQueueItem['status'] }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.status = action.payload.status;
      }
    },
    setProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
        const item = state.items.find(item => item.id === action.payload.id);
        if (item) {
            item.progress = action.payload.progress;
        }
    },
    retry: (state, action: PayloadAction<string>) => {
        const item = state.items.find(item => item.id === action.payload);
        if (item && item.status === 'error') {
            item.status = 'uploading';
            item.progress = 0;
        }
    }
  },
});

export const { add, remove, setStatus, setProgress, retry } = uploadQueueSlice.actions;

export default uploadQueueSlice.reducer;