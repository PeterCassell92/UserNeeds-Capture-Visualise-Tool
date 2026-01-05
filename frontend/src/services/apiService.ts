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
 * Centralizes all HTTP requests and handles demo mode parameter injection.
 */
export class ApiService {
  private client: AxiosInstance;
  private demoMode: boolean = false;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Set demo mode for all subsequent requests
   */
  setDemoMode(enabled: boolean): void {
    this.demoMode = enabled;
  }

  /**
   * Get current demo mode state
   */
  getDemoMode(): boolean {
    return this.demoMode;
  }

  /**
   * Get demo mode params for requests
   */
  private getDemoParams(): { demo_mode: boolean } {
    return { demo_mode: this.demoMode };
  }

  // ==================== Setup ====================

  async checkSetup(): Promise<CheckSetupResponse> {
    const response = await this.client.get<CheckSetupResponse>('/check-setup', {
      params: this.getDemoParams(),
    });
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
    const params: Record<string, string | boolean> = {
      ...this.getDemoParams(),
    };

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
    const response = await this.client.get<UserNeed>(`/user-needs/${id}`, {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  async createUserNeed(userNeed: UserNeedCreate): Promise<UserNeed> {
    const response = await this.client.post<UserNeed>('/user-needs', userNeed, {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  async updateUserNeed(id: string, data: UserNeedUpdate): Promise<UserNeed> {
    const response = await this.client.put<UserNeed>(`/user-needs/${id}`, data, {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  async deleteUserNeed(id: string): Promise<void> {
    await this.client.delete(`/user-needs/${id}`, {
      params: this.getDemoParams(),
    });
  }

  // ==================== User Groups ====================

  async getUserGroups(): Promise<UserGroup[]> {
    const response = await this.client.get<UserGroup[]>('/user-groups', {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  async createUserGroup(userGroup: UserGroup): Promise<UserGroup> {
    const response = await this.client.post<UserGroup>('/user-groups', userGroup, {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  // ==================== User Super Groups ====================

  async getUserSuperGroups(): Promise<UserSuperGroup[]> {
    const response = await this.client.get<UserSuperGroup[]>('/user-super-groups', {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  async createUserSuperGroup(superGroup: UserSuperGroup): Promise<UserSuperGroup> {
    const response = await this.client.post<UserSuperGroup>('/user-super-groups', superGroup, {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  // ==================== Entities ====================

  async getEntities(): Promise<Entity[]> {
    const response = await this.client.get<Entity[]>('/entities', {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  // ==================== Workflow Phases ====================

  async getWorkflowPhases(): Promise<WorkflowPhase[]> {
    const response = await this.client.get<WorkflowPhase[]>('/workflow-phases', {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<Statistics> {
    const response = await this.client.get<Statistics>('/statistics', {
      params: this.getDemoParams(),
    });
    return response.data;
  }

  // ==================== Next ID ====================

  async getNextId(userGroupId: string): Promise<{ nextId: string }> {
    const response = await this.client.get<{ nextId: string }>(`/next-id/${userGroupId}`, {
      params: this.getDemoParams(),
    });
    return response.data;
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export default apiService;
