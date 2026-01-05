import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/apiService';

interface DemoModeResponse {
  enabled: boolean;
  locked: boolean;
}

interface SettingsState {
  demoMode: boolean;
  demoModeLocked: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  demoMode: false,
  demoModeLocked: false,
  loading: false,
  error: null,
};

// Async thunk to fetch demo mode state from backend
export const fetchDemoMode = createAsyncThunk(
  'settings/fetchDemoMode',
  async () => {
    const response = await apiService.fetchDemoMode();
    return response;
  }
);

// Async thunk to set demo mode on backend
export const setDemoModeAsync = createAsyncThunk(
  'settings/setDemoMode',
  async (enabled: boolean) => {
    const response = await apiService.setDemoModeOnBackend(enabled);
    return response;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch demo mode
      .addCase(fetchDemoMode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDemoMode.fulfilled, (state, action: PayloadAction<DemoModeResponse>) => {
        state.loading = false;
        state.demoMode = action.payload.enabled;
        state.demoModeLocked = action.payload.locked;
      })
      .addCase(fetchDemoMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch demo mode';
      })
      // Set demo mode
      .addCase(setDemoModeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDemoModeAsync.fulfilled, (state, action: PayloadAction<DemoModeResponse>) => {
        state.loading = false;
        state.demoMode = action.payload.enabled;
        state.demoModeLocked = action.payload.locked;
      })
      .addCase(setDemoModeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to set demo mode';
      });
  },
});

export default settingsSlice.reducer;
