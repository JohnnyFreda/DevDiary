import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entriesApi } from '../api/entries';
import Markdown from 'react-markdown';

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: entry, isLoading } = useQuery({
    queryKey: ['entries', id],
    queryFn: () => entriesApi.getById(parseInt(id!)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => entriesApi.delete(parseInt(id!)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      navigate('/entries');
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!entry) {
    return <div className="text-center py-8">Entry not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to="/entries"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to entries
        </Link>
        <div className="flex gap-4">
          <Link
            to={`/entries/${id}/edit`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Edit
          </Link>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this entry?')) {
                deleteMutation.mutate();
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {entry.title || 'Untitled Entry'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{new Date(entry.date).toLocaleDateString()}</span>
            <span>Mood: {entry.mood}/5</span>
            {entry.project && (
              <span className="text-blue-600 dark:text-blue-400">
                {entry.project.name}
              </span>
            )}
          </div>
          {entry.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {entry.body && (
          <div className="prose dark:prose-invert max-w-none mb-6">
            <Markdown>{entry.body}</Markdown>
          </div>
        )}

        {entry.looking_ahead && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Looking Ahead
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <Markdown>{entry.looking_ahead}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

