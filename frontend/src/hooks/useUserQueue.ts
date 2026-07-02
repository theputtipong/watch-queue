import { useQuery } from '@tanstack/react-query';
import { queueApi } from '../api/queueApi';
export function useUserQueue(userId: string) {
  return useQuery({
    queryKey: ['queue', userId],
    queryFn: async ({ signal }) => {
      return queueApi.getQueue(userId, { signal });
    },
    enabled: !!userId,
  });
}
