import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Watch } from '@/backend';

export function useWatches() {
  const { actor, isFetching: isActorFetching } = useActor();

  const allWatchesQuery = useQuery<Watch[]>({
    queryKey: ['watches', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWatches();
    },
    enabled: !!actor && !isActorFetching,
  });

  const featuredWatchesQuery = useQuery<Watch[]>({
    queryKey: ['watches', 'featured'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedWatches();
    },
    enabled: !!actor && !isActorFetching,
  });

  return {
    allWatches: allWatchesQuery.data,
    featuredWatches: featuredWatchesQuery.data,
    isLoading: allWatchesQuery.isLoading || featuredWatchesQuery.isLoading,
    error: allWatchesQuery.error || featuredWatchesQuery.error,
  };
}
