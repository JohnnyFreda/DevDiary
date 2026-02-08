import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entriesApi, EntryCreate } from '../api/entries';
import EntryForm from '../components/EntryForm';

export default function EntryCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: EntryCreate) => entriesApi.create(data),
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      navigate(`/entries/${entry.id}`);
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">New Entry</h1>
      <div className="rounded-xl shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 ring-1 ring-gray-200/50 dark:ring-white/5 p-8">
        <EntryForm
          onSubmit={async (data) => {
            await createMutation.mutateAsync(data as EntryCreate);
          }}
          onCancel={() => navigate('/entries')}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  );
}


