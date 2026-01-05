import axios, { AxiosInstance } from 'axios';
import type {
  UserNeed,
  UserGroup,
  UserSuperGroup,
  Entity,
  WorkflowPhase,
  Statistics,
  UserNeedCreate,
  UserNeedUpdate,
} from '../types';

const API_BASE = '/api';

interface DemoModeResponse {
  enabled: boolean;
  locked: boolean;
}

interface CheckSetupResponse {
  hasData: boolean;
  needsSetup: boolean;
}

/**
 * API Service for interacting with the User Needs Management backend.
 * Centralizes all HTTP requests.
 *
 * Note: Demo mode is now managed by the backend via app_state, so we don't
 * need to pass demo_mode query parameters. The backend maintains its own state.
 */
export class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * @deprecated Demo mode is now managed by backend state. This method is kept
   * for compatibility but does nothing.
   */
  setDemoMode(_enabled: boolean): void {
    // No-op: Backend now manages demo mode state
  }

  // ==================== Setup ====================

  async checkSetup(): Promise<CheckSetupResponse> {
    const response = await this.client.get<CheckSetupResponse>('/check-setup');
    return response.data;
  }

  // ==================== Demo Mode ====================

  async fetchDemoMode(): Promise<DemoModeResponse> {
    const response = await this.client.get<DemoModeResponse>('/demo-mode');
    return response.data;
  }

  async setDemoModeOnBackend(enabled: boolean): Promise<DemoModeResponse> {
    const response = await this.client.post<DemoModeResponse>('/demo-mode', { enabled });
    return response.data;
  }

  // ==================== User Needs ====================

  async getUserNeeds(filters?: {
    userGroupId?: string;
    entity?: string;
    workflowPhase?: string;
    superGroup?: string;
    refined?: 'all' | 'refined' | 'needsRefinement';
  }): Promise<UserNeed[]> {
    const params: Record<string, string> = {};

    if (filters) {
      if (filters.userGroupId) params.userGroupId = filters.userGroupId;
      if (filters.entity) params.entity = filters.entity;
      if (filters.workflowPhase) params.workflowPhase = filters.workflowPhase;
      if (filters.superGroup) params.superGroup = filters.superGroup;
      if (filters.refined && filters.refined !== 'all') params.refined = filters.refined;
    }

    const response = await this.client.get<UserNeed[]>('/user-needs', { params });
    return response.data;
  }

  async getUserNeed(id: string): Promise<UserNeed> {
    const response = await this.client.get<UserNeed>(`/user-needs/${id}`);
    return response.data;
  }

  async createUserNeed(userNeed: UserNeedCreate): Promise<UserNeed> {
    const response = await this.client.post<UserNeed>('/user-needs', userNeed);
    return response.data;
  }

  async updateUserNeed(id: string, data: UserNeedUpdate): Promise<UserNeed> {
    const response = await this.client.put<UserNeed>(`/user-needs/${id}`, data);
    return response.data;
  }

  async deleteUserNeed(id: string): Promise<void> {
    await this.client.delete(`/user-needs/${id}`);
  }

  // ==================== User Groups ====================

  async getUserGroups(): Promise<UserGroup[]> {
    const response = await this.client.get<UserGroup[]>('/user-groups');
    return response.data;
  }

  async createUserGroup(userGroup: UserGroup): Promise<UserGroup> {
    const response = await this.client.post<UserGroup>('/user-groups', userGroup);
    return response.data;
  }

  // ==================== User Super Groups ====================

  async getUserSuperGroups(): Promise<UserSuperGroup[]> {
    const response = await this.client.get<UserSuperGroup[]>('/user-super-groups');
    return response.data;
  }

  async createUserSuperGroup(superGroup: UserSuperGroup): Promise<UserSuperGroup> {
    const response = await this.client.post<UserSuperGroup>('/user-super-groups', superGroup);
    return response.data;
  }

  // ==================== Entities ====================

  async getEntities(): Promise<Entity[]> {
    const response = await this.client.get<Entity[]>('/entities');
    return response.data;
  }

  // ==================== Workflow Phases ====================

  async getWorkflowPhases(): Promise<WorkflowPhase[]> {
    const response = await this.client.get<WorkflowPhase[]>('/workflow-phases');
    return response.data;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<Statistics> {
    const response = await this.client.get<Statistics>('/statistics');
    return response.data;
  }

  // ==================== Next ID ====================

  async getNextId(userGroupId: string): Promise<{ nextId: string }> {
    const response = await this.client.get<{ nextId: string }>(`/next-id/${userGroupId}`);
    return response.data;
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export default apiService;
