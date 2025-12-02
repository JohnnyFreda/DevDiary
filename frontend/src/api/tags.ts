// Mock tags API - uses localStorage
import { mockTagsService, Tag } from '../services/mockData';

export type { Tag };

export interface TagCreate {
  name: string;
}

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    return mockTagsService.getAll();
  },

  create: async (data: TagCreate): Promise<Tag> => {
    return mockTagsService.create(data.name);
  },

  delete: async (id: number): Promise<void> => {
    return mockTagsService.delete(id);
  },
};
