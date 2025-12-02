// Mock projects API - uses localStorage
import { mockProjectsService, Project } from '../services/mockData';

export type { Project };

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
}

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    return mockProjectsService.getAll();
  },

  create: async (data: ProjectCreate): Promise<Project> => {
    return mockProjectsService.create(data);
  },

  update: async (id: number, data: ProjectUpdate): Promise<Project> => {
    return mockProjectsService.update(id, data);
  },

  delete: async (id: number): Promise<void> => {
    return mockProjectsService.delete(id);
  },
};
