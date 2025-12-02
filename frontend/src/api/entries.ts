// Mock entries API - uses localStorage
import { mockEntriesService, Entry as MockEntry } from '../services/mockData';

// Attachment interface
export interface Attachment {
  type: 'link' | 'document' | 'reference';
  title: string;
  url: string;
  description?: string;
}

// Entry interface for components (tags as objects)
export interface Entry {
  id: number;
  user_id: number;
  project_id?: number;
  date: string;
  title?: string;
  body?: string;
  looking_ahead?: string;
  mood: number | null;
  focus_score?: number;
  created_at: string;
  updated_at: string;
  tags: Array<{ id: number; name: string }>;
  project?: { id: number; name: string; description?: string };
  attachments?: Attachment[];
}

export interface EntryCreate {
  date: string;
  title?: string;
  body?: string;
  looking_ahead?: string;
  mood?: number | null;
  focus_score?: number | null;
  project_id?: number | null;
  tags?: string[];
  attachments?: Attachment[];
}

export interface EntryUpdate {
  date?: string;
  title?: string;
  body?: string;
  looking_ahead?: string;
  mood?: number | null;
  focus_score?: number | null;
  project_id?: number | null;
  tags?: string[];
  attachments?: Attachment[];
}

export interface EntryFilters {
  project_id?: number;
  tag?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

// Helper to convert mock entry to API entry format
const convertEntry = async (mockEntry: MockEntry): Promise<Entry> => {
  const mockData = await import('../services/mockData');
  const tags = await mockData.mockTagsService.getAll();
  
  // Convert tag strings to tag objects
  const entryTags = mockEntry.tags
    .map((tagName) => {
      const tag = tags.find((t) => t.name === tagName);
      return tag ? { id: tag.id, name: tag.name } : null;
    })
    .filter((t): t is { id: number; name: string } => t !== null);

  // Get project if exists
  let project;
  if (mockEntry.project_id) {
    const projects = await mockData.mockProjectsService.getAll();
    const proj = projects.find((p) => p.id === mockEntry.project_id);
    if (proj) {
      project = {
        id: proj.id,
        name: proj.name,
        description: proj.description || undefined,
      };
    }
  }

  return {
    ...mockEntry,
    tags: entryTags,
    project,
  };
};

export const entriesApi = {
  getAll: async (filters?: EntryFilters): Promise<Entry[]> => {
    const mockEntries = await mockEntriesService.getAll(filters);
    return Promise.all(mockEntries.map(convertEntry));
  },

  getById: async (id: number): Promise<Entry> => {
    const mockEntry = await mockEntriesService.getById(id);
    return convertEntry(mockEntry);
  },

  create: async (data: EntryCreate): Promise<Entry> => {
    const mockEntry = await mockEntriesService.create(data);
    return convertEntry(mockEntry);
  },

  update: async (id: number, data: EntryUpdate): Promise<Entry> => {
    const mockEntry = await mockEntriesService.update(id, data);
    return convertEntry(mockEntry);
  },

  delete: async (id: number): Promise<void> => {
    return mockEntriesService.delete(id);
  },
};
