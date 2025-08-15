import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { closeAllChats, closeChat, openChat } from './features/openedChatsSlice';
import { createRtkQueryErrorMiddleware } from './middleware/rtkQueryErrorMiddleware';
import { RootState } from './store';

export const openedChatsListener = createListenerMiddleware();
openedChatsListener.startListening({
  matcher: isAnyOf(openChat, closeChat, closeAllChats),

  effect: (payload, action) => {
    const state = action.getState() as RootState;
    localStorage.setItem('openedChats', JSON.stringify(state.openedChats.chatIds));
  },
});

export const rtkQueryErrorMiddleware = createRtkQueryErrorMiddleware({
  // optional: attach real handlers here, e.g., logout(), toast()
});

export default [openedChatsListener.middleware, rtkQueryErrorMiddleware];
