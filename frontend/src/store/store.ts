import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import filtersReducer from './filtersSlice';
import userNeedsReducer from './userNeedsSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    filters: filtersReducer,
    userNeeds: userNeedsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
