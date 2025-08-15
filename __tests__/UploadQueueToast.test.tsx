import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UploadQueueToast from '@/components/UploadQueueToast';
import uploadQueueReducer from '@/redux/features/uploadQueueSlice';

function makeStore(preloadedState: any) {
  return configureStore({
    reducer: { uploadQueue: uploadQueueReducer },
    preloadedState: preloadedState,
  });
}

describe('UploadQueueToast', () => {
  it('shows uploading snackbar when items are uploading', () => {
    const store = makeStore({
      uploadQueue: {
        items: [{ id: '1', file: new File(['x'], 'a.jpg'), path: 'p/a', status: 'uploading', progress: 42 }],
      },
    });
    
    const { getByText } = render(
      <Provider store={store}>
        <UploadQueueToast />
      </Provider>
    );
    
    expect(getByText(/Uploading 1 file/)).toBeInTheDocument();
    expect(getByText('42%')).toBeInTheDocument();
  });

  it('shows error snackbar when items have errors', () => {
    const store = makeStore({
      uploadQueue: {
        items: [{ id: '1', file: new File(['x'], 'error.jpg'), path: 'p/error', status: 'error', progress: 0, error: 'Upload failed' }],
      },
    });
    
    const { getByText } = render(
      <Provider store={store}>
        <UploadQueueToast />
      </Provider>
    );
    
    expect(getByText(/Upload failed: error.jpg/)).toBeInTheDocument();
  });

  it('does not show toasts when no uploads are active', () => {
    const store = makeStore({
      uploadQueue: { items: [] },
    });
    
    const { queryByText } = render(
      <Provider store={store}>
        <UploadQueueToast />
      </Provider>
    );
    
    expect(queryByText(/Uploading/)).not.toBeInTheDocument();
    expect(queryByText(/Upload failed/)).not.toBeInTheDocument();
  });

  it('shows correct plural form for multiple uploads', () => {
    const store = makeStore({
      uploadQueue: {
        items: [
          { id: '1', file: new File(['x'], 'a.jpg'), path: 'p/a', status: 'uploading', progress: 30 },
          { id: '2', file: new File(['y'], 'b.jpg'), path: 'p/b', status: 'uploading', progress: 60 },
        ],
      },
    });
    
    const { getByText } = render(
      <Provider store={store}>
        <UploadQueueToast />
      </Provider>
    );
    
    expect(getByText(/Uploading 2 files/)).toBeInTheDocument();
    expect(getByText('45%')).toBeInTheDocument(); // Average of 30% and 60%
  });
});