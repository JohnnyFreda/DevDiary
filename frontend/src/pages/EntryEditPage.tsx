import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entriesApi, EntryUpdate } from '../api/entries';
import EntryForm from '../components/EntryForm';

export default function EntryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: entry, isLoading } = useQuery({
    queryKey: ['entries', id],
    queryFn: () => entriesApi.getById(parseInt(id!)),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: EntryUpdate) => entriesApi.update(parseInt(id!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      navigate(`/entries/${id}`);
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!entry) {
    return <div className="text-center py-8">Entry not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Entry</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <EntryForm
          entry={entry}
          onSubmit={async (data) => {
            await updateMutation.mutateAsync(data);
          }}
          onCancel={() => navigate(`/entries/${id}`)}
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
}

