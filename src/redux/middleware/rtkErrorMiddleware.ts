import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { enqueueSnackbar } from 'notistack';

export const rtkErrorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const message =
      action.payload?.data?.detail ??
      action.error?.message ??
      'Unknown error';
    enqueueSnackbar(message, { variant: 'error' });
  }

  return next(action);
};
