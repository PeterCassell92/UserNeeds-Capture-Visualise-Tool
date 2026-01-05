import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  userGroupId: string;
  entity: string;
  workflowPhase: string;
  superGroup: string;
  refined: 'all' | 'refined' | 'needsRefinement';
}

const initialState: FiltersState = {
  userGroupId: '',
  entity: '',
  workflowPhase: '',
  superGroup: '',
  refined: 'all',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setUserGroupFilter: (state, action: PayloadAction<string>) => {
      state.userGroupId = action.payload;
    },
    setEntityFilter: (state, action: PayloadAction<string>) => {
      state.entity = action.payload;
    },
    setWorkflowPhaseFilter: (state, action: PayloadAction<string>) => {
      state.workflowPhase = action.payload;
    },
    setSuperGroupFilter: (state, action: PayloadAction<string>) => {
      state.superGroup = action.payload;
    },
    setRefinedFilter: (state, action: PayloadAction<'all' | 'refined' | 'needsRefinement'>) => {
      state.refined = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      return { ...state, ...action.payload };
    },
    clearFilters: () => {
      return initialState;
    },
  },
});

export const {
  setUserGroupFilter,
  setEntityFilter,
  setWorkflowPhaseFilter,
  setSuperGroupFilter,
  setRefinedFilter,
  setFilters,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
