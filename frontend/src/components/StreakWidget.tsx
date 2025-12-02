import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../api/insights';

export default function StreakWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['insights', 'summary'],
    queryFn: insightsApi.getSummary,
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Streak</h3>
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
        {data?.streak || 0}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">days in a row</p>
    </div>
  );
}

