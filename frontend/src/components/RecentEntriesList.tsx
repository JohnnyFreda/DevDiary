import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { entriesApi, Entry } from '../api/entries';

export default function RecentEntriesList() {
  const { data: entries, isLoading } = useQuery({
    queryKey: ['entries', { limit: 5 }],
    queryFn: () => entriesApi.getAll(),
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const recentEntries = entries?.slice(0, 5) || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Entries</h3>
      {recentEntries.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No entries yet. Create your first entry!</p>
      ) : (
        <div className="space-y-3">
          {recentEntries.map((entry: Entry) => (
            <Link
              key={entry.id}
              to={`/entries/${entry.id}`}
              className="block p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {entry.title || 'Untitled Entry'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Mood: {entry.mood}/5
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

