import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type CartItem } from '@/backend';

function getUserId(): string {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
}

export function useCart() {
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();
  const userId = getUserId();

  const cartQuery = useQuery<CartItem[]>({
    queryKey: ['cart', userId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart(userId);
    },
    enabled: !!actor && !isActorFetching,
  });

  const cartTotalQuery = useQuery<bigint>({
    queryKey: ['cartTotal', userId],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCartTotal(userId);
    },
    enabled: !!actor && !isActorFetching,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ watchId, quantity }: { watchId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addToCart(userId, watchId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal', userId] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (watchId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.removeFromCart(userId, watchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal', userId] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ watchId, quantity }: { watchId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateCartItemQuantity(userId, watchId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal', userId] });
    },
  });

  const cartCount = cartQuery.data?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  return {
    cart: cartQuery.data,
    cartTotal: cartTotalQuery.data || BigInt(0),
    cartCount,
    isLoading: cartQuery.isLoading || cartTotalQuery.isLoading,
    addToCart: (watchId: bigint, quantity: bigint) => addToCartMutation.mutateAsync({ watchId, quantity }),
    removeFromCart: (watchId: bigint) => removeFromCartMutation.mutateAsync(watchId),
    updateQuantity: (watchId: bigint, quantity: bigint) => updateQuantityMutation.mutateAsync({ watchId, quantity }),
    isAdding: addToCartMutation.isPending,
  };
}
