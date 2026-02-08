import { useState } from 'react';
import QuickEntryForm from '../components/QuickEntryForm';
import StreakWidget from '../components/StreakWidget';
import RecentEntriesList from '../components/RecentEntriesList';
import MoodChart from '../components/MoodChart';
import SmallCalendar from '../components/SmallCalendar';

export default function DashboardPage() {
  const [isEntryFormExpanded, setIsEntryFormExpanded] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Overview of your week</p>
        </div>
        {!isEntryFormExpanded && (
          <button
            onClick={() => setIsEntryFormExpanded(true)}
            className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            New Entry
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isEntryFormExpanded && (
            <QuickEntryForm onClose={() => setIsEntryFormExpanded(false)} />
          )}
          <MoodChart />
        </div>
        <div className="space-y-6">
          <StreakWidget />
          <SmallCalendar />
          <RecentEntriesList />
        </div>
      </div>
    </div>
  );
}

