import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = '/api';

interface SettingsState {
  demoMode: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  demoMode: false,
  loading: false,
  error: null,
};

// Async thunk to fetch demo mode state from backend
export const fetchDemoMode = createAsyncThunk(
  'settings/fetchDemoMode',
  async () => {
    const response = await axios.get<{ enabled: boolean }>(`${API_BASE}/demo-mode`);
    return response.data.enabled;
  }
);

// Async thunk to set demo mode on backend
export const setDemoModeAsync = createAsyncThunk(
  'settings/setDemoMode',
  async (enabled: boolean) => {
    const response = await axios.post<{ enabled: boolean }>(
      `${API_BASE}/demo-mode`,
      { enabled }
    );
    return response.data.enabled;
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
      .addCase(fetchDemoMode.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.demoMode = action.payload;
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
      .addCase(setDemoModeAsync.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.demoMode = action.payload;
      })
      .addCase(setDemoModeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to set demo mode';
      });
  },
});

export default settingsSlice.reducer;
