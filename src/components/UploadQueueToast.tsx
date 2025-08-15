import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { Snackbar, Alert, Box, LinearProgress, Typography, IconButton, Stack, Paper, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { remove, setStatus, retry } from '@/redux/features/uploadQueueSlice';

/**
 * Shows:
 *  - Persistent progress toast while any upload is "uploading"
 *  - One-shot error toast if any item hits "error"
 *  - Lets user dismiss completed/error items
 */
export default function UploadQueueToast() {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.uploadQueue.items);

  const uploading = items.filter(i => i.status === 'uploading');
  const errors = items.filter(i => i.status === 'error');
  const anyUploading = uploading.length > 0;
  const latestError = errors[errors.length - 1];

  // Aggregate progress for a simple UX (avg of active uploads)
  const avgProgress =
    uploading.length > 0
      ? Math.round(uploading.reduce((acc, i) => acc + (i.progress ?? 0), 0) / uploading.length)
      : 0;

  const handleDismissError = () => {
    if (!latestError) return;
    dispatch(remove(latestError.id));
  };

  const handleCancelAll = () => {
    // Soft-cancel: mark as canceled (upload task cancellation happens in hook if you wire it)
    uploading.forEach(i => dispatch(setStatus({ id: i.id, status: 'canceled' })));
  };

  const handleRetry = () => {
    if (latestError) {
      dispatch(retry(latestError.id));
    }
  }

  return (
    <>
      {/* UPLOADING TOAST */}
      <Snackbar
        open={anyUploading}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper elevation={6} sx={{ p: 2, minWidth: 320 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">
                Uploading {uploading.length} file{uploading.length > 1 ? 's' : ''}
              </Typography>
              <LinearProgress variant="determinate" value={avgProgress} sx={{ mt: 1 }} />
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                {avgProgress}% • Don't close this tab
              </Typography>
            </Box>
            <IconButton aria-label="cancel uploads" onClick={handleCancelAll}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Paper>
      </Snackbar>

      {/* ERROR TOAST */}
      <Snackbar
        open={Boolean(latestError)}
        autoHideDuration={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          sx={{ width: '100%' }}
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={handleRetry}
              >
                Retry
              </Button>
              <IconButton size="small" color="inherit" onClick={handleDismissError}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        >
          {latestError
            ? `Upload failed: ${latestError.file?.name ?? 'unknown'}`
            : 'Upload failed'}
        </Alert>
      </Snackbar>
    </>
  );
}