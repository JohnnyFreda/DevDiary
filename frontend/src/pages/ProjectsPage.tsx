import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectsApi, Project, ProjectCreate } from '../api/projects';
import { entriesApi, Entry } from '../api/entries';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function ProjectsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectCreate) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreating(false);
      setName('');
      setDescription('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Fetch entries for the expanded project
  const { data: projectEntries } = useQuery({
    queryKey: ['entries', 'project', expandedProjectId],
    queryFn: () => entriesApi.getAll({ project_id: expandedProjectId! }),
    enabled: expandedProjectId !== null,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name, description: description || undefined });
  };

  const toggleProject = (projectId: number) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          {isCreating ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create Project</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: Project) => {
            const isExpanded = expandedProjectId === project.id;
            const entries = isExpanded ? projectEntries : undefined;
            
            return (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => toggleProject(project.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex-1">
                      {project.name}
                    </h3>
                    {isExpanded ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {isExpanded && entries ? `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}` : 'Click to view entries'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this project?')) {
                          deleteMutation.mutate(project.id);
                        }
                      }}
                      className="text-red-600 dark:text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                    {entries && entries.length > 0 ? (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {entries.map((entry: Entry) => (
                          <Link
                            key={entry.id}
                            to={`/entries/${entry.id}`}
                            className="block p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                {entry.title || 'Untitled Entry'}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                {new Date(entry.date).toLocaleDateString()}
                              </span>
                            </div>
                            {entry.body && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-1">
                                {entry.body.replace(/[#*`]/g, '').substring(0, 100)}
                                {entry.body.length > 100 ? '...' : ''}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {entry.mood && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Mood: {entry.mood}/5
                                </span>
                              )}
                              {entry.tags && entry.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {entry.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag.id}
                                      className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                                    >
                                      {tag.name}
                                    </span>
                                  ))}
                                  {entry.tags.length > 2 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      +{entry.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No entries for this project yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No projects yet. Create your first project!
        </div>
      )}
    </div>
  );
}

