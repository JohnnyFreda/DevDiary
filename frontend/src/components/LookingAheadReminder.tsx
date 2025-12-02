import { useState, useEffect } from 'react';
import { Entry, entriesApi } from '../api/entries';
import Markdown from 'react-markdown';

interface LookingAheadReminderProps {
  onDismiss: () => void;
}

export default function LookingAheadReminder({ onDismiss }: LookingAheadReminderProps) {
  const [yesterdayEntry, setYesterdayEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchYesterdayEntry = async () => {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const entries = await entriesApi.getAll({ date_from: yesterdayStr, date_to: yesterdayStr });
        const entry = entries.find(e => e.looking_ahead && e.looking_ahead.trim().length > 0);
        
        setYesterdayEntry(entry || null);
      } catch (error) {
        console.error('Error fetching yesterday entry:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchYesterdayEntry();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!yesterdayEntry || !yesterdayEntry.looking_ahead) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Looking Ahead from Yesterday
            </h2>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Dismiss"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              From {new Date(yesterdayEntry.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <Markdown>{yesterdayEntry.looking_ahead}</Markdown>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onDismiss}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

