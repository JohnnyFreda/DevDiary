import { apiClient } from './client';

export interface Project {
  id: number;
  user_id?: number;
  name: string;
  description?: string | null;
  created_at: string;
}

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
    const { data } = await apiClient.get<Project[]>('/projects');
    return Array.isArray(data) ? data.map((p) => ({ ...p, created_at: String(p.created_at) })) : [];
  },

  create: async (data: ProjectCreate): Promise<Project> => {
    const { data: created } = await apiClient.post<Project>('/projects', {
      name: data.name,
      description: data.description ?? null,
    });
    return { ...created, created_at: String(created.created_at) };
  },

  update: async (id: number, data: ProjectUpdate): Promise<Project> => {
    const body: Record<string, unknown> = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.description !== undefined) body.description = data.description;
    const { data: updated } = await apiClient.put<Project>(`/projects/${id}`, body);
    return { ...updated, created_at: String(updated.created_at) };
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};
