import QuickEntryForm from '../components/QuickEntryForm';
import StreakWidget from '../components/StreakWidget';
import RecentEntriesList from '../components/RecentEntriesList';
import MoodChart from '../components/MoodChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickEntryForm />
          <MoodChart />
        </div>
        <div className="space-y-6">
          <StreakWidget />
          <RecentEntriesList />
        </div>
      </div>
    </div>
  );
}

