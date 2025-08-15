import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Existing Feature Slices
import openedChatsReducer from './features/openedChatsSlice';
import uploadQueueReducer from './features/uploadQueueSlice';

// Existing API Services
import { allUsersPublicDataAPI } from './services/allUsersPublicDataAPI';
import { loggedUserAPI } from './services/loggedUserAPI';
import { userDataAPI } from './services/userDataAPI';

// Import middlewares
import middlewares from './middlewares';

export const store = configureStore({
  reducer: {
    // Existing features
    openedChats: openedChatsReducer,
    uploadQueue: uploadQueueReducer,
    
    // Existing APIs
    [allUsersPublicDataAPI.reducerPath]: allUsersPublicDataAPI.reducer,
    [loggedUserAPI.reducerPath]: loggedUserAPI.reducer,
    [userDataAPI.reducerPath]: userDataAPI.reducer,
    
    // Boatable features (to be implemented)
    // vessels: vesselsReducer,
    // marketplace: marketplaceReducer,
    // groups: groupsReducer,
    // maintenance: maintenanceReducer,
    // maps: mapsReducer,
    // weather: weatherReducer,
    // crew: crewReducer,
    
    // Boatable APIs (to be implemented)
    // [boatableAPI.reducerPath]: boatableAPI.reducer,
    // [marketplaceAPI.reducerPath]: marketplaceAPI.reducer,
    // [weatherAPI.reducerPath]: weatherAPI.reducer,
    // [mapsAPI.reducerPath]: mapsAPI.reducer,
    // [pricingAPI.reducerPath]: pricingAPI.reducer,
    // [diagnosticsAPI.reducerPath]: diagnosticsAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat([
      // Existing middleware
      ...middlewares,
      
      // Existing APIs
      allUsersPublicDataAPI.middleware,
      loggedUserAPI.middleware,
      userDataAPI.middleware,
      
      // Boatable APIs (to be implemented)
      // boatableAPI.middleware,
      // marketplaceAPI.middleware,
      // weatherAPI.middleware,
      // mapsAPI.middleware,
      // pricingAPI.middleware,
      // diagnosticsAPI.middleware
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Boatable-specific types and selectors (to be implemented)
export interface BoatableState {
  vessels: any[];
  marketplace: {
    listings: any[];
    filters: any;
    searchResults: any[];
  };
  groups: {
    userGroups: any[];
    allGroups: any[];
    currentGroup: any;
  };
  maintenance: {
    tasks: any[];
    schedule: any[];
    alerts: any[];
  };
  weather: {
    current: any;
    forecast: any[];
    alerts: any[];
  };
  maps: {
    userLocation: any;
    routes: any[];
    marinas: any[];
    landmarks: any[];
  };
  crew: {
    positions: any[];
    applications: any[];
    schedule: any[];
  };
}
