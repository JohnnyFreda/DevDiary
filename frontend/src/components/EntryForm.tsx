import { useState, useEffect } from 'react';
import { Entry, EntryCreate, EntryUpdate } from '../api/entries';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api/projects';
import MoodSelector from './MoodSelector';
import ProjectSelector from './ProjectSelector';
import TagInput from './TagInput';
import MarkdownEditor from './MarkdownEditor';

interface EntryFormProps {
  entry?: Entry;
  onSubmit: (data: EntryCreate | EntryUpdate) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function EntryForm({ entry, onSubmit, onCancel, isLoading }: EntryFormProps) {
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState(entry?.title || '');
  const [body, setBody] = useState(entry?.body || '');
  const [mood, setMood] = useState(entry?.mood || 3);
  const [projectId, setProjectId] = useState<number | undefined>(entry?.project_id);
  const [tags, setTags] = useState<string[]>(entry?.tags.map(t => t.name) || []);

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      date,
      title: title || undefined,
      body: body || undefined,
      mood,
      project_id: projectId,
      tags,
    };
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Body (Markdown)
        </label>
        <MarkdownEditor value={body} onChange={setBody} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mood
          </label>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project
          </label>
          <ProjectSelector
            projects={projects || []}
            value={projectId}
            onChange={setProjectId}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags
        </label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : entry ? 'Update Entry' : 'Create Entry'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

