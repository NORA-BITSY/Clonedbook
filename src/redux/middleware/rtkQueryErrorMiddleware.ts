import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';

type Deps = {
  onUnauthorized?: () => void;
  onError?: (payload: unknown) => void;
};

export const createRtkQueryErrorMiddleware = (deps: Deps = {}): Middleware =>
  () => next => action => {
    if (isRejectedWithValue(action)) {
      const status = (action.payload as any)?.status;
      if (status === 401) {
        deps.onUnauthorized?.();
        // Fallback log so devs still see it in console
        // eslint-disable-next-line no-console
        console.warn('Unauthorized — redirecting to login.');
      }
      deps.onError?.(action.payload);
      // eslint-disable-next-line no-console
      console.error('API error:', action.payload);
    }
    return next(action);
  };