import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { apiService } from '../services/apiService';
import type {
  UserNeed,
  UserGroup,
  Entity,
  WorkflowPhase,
  Statistics,
  UserNeedCreate,
  UserNeedUpdate,
} from '../types';
import type { RootState } from './store';

interface UserNeedsState {
  userNeeds: UserNeed[];
  userGroups: UserGroup[];
  entities: Entity[];
  workflowPhases: WorkflowPhase[];
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserNeedsState = {
  userNeeds: [],
  userGroups: [],
  entities: [],
  workflowPhases: [],
  statistics: null,
  loading: false,
  error: null,
};

// Async thunk to load all reference data (user groups, entities, phases, stats)
export const loadReferenceData = createAsyncThunk(
  'userNeeds/loadReferenceData',
  async () => {
    const [userGroups, entities, workflowPhases, statistics] = await Promise.all([
      apiService.getUserGroups(),
      apiService.getEntities(),
      apiService.getWorkflowPhases(),
      apiService.getStatistics(),
    ]);

    return {
      userGroups,
      entities,
      workflowPhases,
      statistics,
    };
  }
);

// Async thunk to load user needs with current filters
export const loadUserNeeds = createAsyncThunk(
  'userNeeds/loadUserNeeds',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const filters = state.filters;

    const filterParams = {
      userGroupId: filters.userGroupId || undefined,
      entity: filters.entity || undefined,
      workflowPhase: filters.workflowPhase || undefined,
      superGroup: filters.superGroup || undefined,
      refined: filters.refined,
    };

    return await apiService.getUserNeeds(filterParams);
  }
);

// Async thunk to create a user need
export const createUserNeed = createAsyncThunk(
  'userNeeds/createUserNeed',
  async (userNeed: UserNeedCreate) => {
    return await apiService.createUserNeed(userNeed);
  }
);

// Async thunk to update a user need
export const updateUserNeed = createAsyncThunk(
  'userNeeds/updateUserNeed',
  async ({ id, data }: { id: string; data: UserNeedUpdate }) => {
    return await apiService.updateUserNeed(id, data);
  }
);

// Async thunk to delete a user need
export const deleteUserNeed = createAsyncThunk(
  'userNeeds/deleteUserNeed',
  async (id: string) => {
    await apiService.deleteUserNeed(id);
    return id;
  }
);

// Async thunk to create a user group
export const createUserGroup = createAsyncThunk(
  'userNeeds/createUserGroup',
  async (userGroup: UserGroup) => {
    return await apiService.createUserGroup(userGroup);
  }
);

const userNeedsSlice = createSlice({
  name: 'userNeeds',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load reference data
      .addCase(loadReferenceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadReferenceData.fulfilled, (state, action) => {
        state.loading = false;
        state.userGroups = [...action.payload.userGroups];
        state.entities = [...action.payload.entities];
        state.workflowPhases = [...action.payload.workflowPhases];
        state.statistics = action.payload.statistics;
      })
      .addCase(loadReferenceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load reference data';
      })
      // Load user needs
      .addCase(loadUserNeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserNeeds.fulfilled, (state, action: PayloadAction<UserNeed[]>) => {
        state.loading = false;
        state.userNeeds = [...action.payload];
      })
      .addCase(loadUserNeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load user needs';
      })
      // Create user need
      .addCase(createUserNeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserNeed.fulfilled, (state, action: PayloadAction<UserNeed>) => {
        state.loading = false;
        state.userNeeds.push(action.payload);
      })
      .addCase(createUserNeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user need';
      })
      // Update user need
      .addCase(updateUserNeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserNeed.fulfilled, (state, action: PayloadAction<UserNeed>) => {
        state.loading = false;
        const index = state.userNeeds.findIndex((need) => need.id === action.payload.id);
        if (index !== -1) {
          state.userNeeds[index] = action.payload;
        }
      })
      .addCase(updateUserNeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user need';
      })
      // Delete user need
      .addCase(deleteUserNeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserNeed.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.userNeeds = state.userNeeds.filter((need) => need.id !== action.payload);
      })
      .addCase(deleteUserNeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user need';
      })
      // Create user group
      .addCase(createUserGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserGroup.fulfilled, (state, action: PayloadAction<UserGroup>) => {
        state.loading = false;
        state.userGroups.push(action.payload);
      })
      .addCase(createUserGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user group';
      });
  },
});

export const { clearError } = userNeedsSlice.actions;

// Selectors
// Memoized selector that returns sorted workflow phases
export const selectSortedWorkflowPhases = createSelector(
  [(state: RootState) => state.userNeeds.workflowPhases],
  (workflowPhases) => {
    return [...workflowPhases].sort((a, b) => a.order - b.order);
  }
);

export default userNeedsSlice.reducer;
