import { apiClient } from './client';

export interface Tag {
  id: number;
  name: string;
}

export interface TagCreate {
  name: string;
}

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const { data } = await apiClient.get<Tag[]>('/tags');
    return Array.isArray(data) ? data : [];
  },

  create: async (data: TagCreate): Promise<Tag> => {
    const { data: created } = await apiClient.post<Tag>('/tags', { name: data.name });
    return created;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tags/${id}`);
  },
};
