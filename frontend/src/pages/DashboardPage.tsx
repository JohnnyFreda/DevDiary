import { useState } from 'react';
import QuickEntryForm from '../components/QuickEntryForm';
import StreakWidget from '../components/StreakWidget';
import RecentEntriesList from '../components/RecentEntriesList';
import MoodChart from '../components/MoodChart';
import SmallCalendar from '../components/SmallCalendar';

export default function DashboardPage() {
  const [isEntryFormExpanded, setIsEntryFormExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        {!isEntryFormExpanded && (
          <button
            onClick={() => setIsEntryFormExpanded(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            New Entry
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

