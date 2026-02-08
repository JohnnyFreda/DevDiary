import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { insightsApi } from '../api/insights';

export default function MoodChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['insights', 'mood-trend', 30],
    queryFn: () => insightsApi.getMoodTrend(30),
  });

  if (isLoading) {
    return (
      <div className="rounded-xl shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 ring-1 ring-gray-200/50 dark:ring-white/5 p-6 space-y-4">
        <div className="h-6 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 ring-1 ring-gray-200/50 dark:ring-white/5 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mood Trend (30 days)</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">No data available yet. Add entries with mood to see your trend.</p>
        <Link
          to="/entries/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white font-medium rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Create entry
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 ring-1 ring-gray-200/50 dark:ring-white/5 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mood Trend (30 days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis domain={[1, 5]} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => [value?.toFixed(1), 'Mood']}
          />
          <Line
            type="monotone"
            dataKey="average_mood"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

