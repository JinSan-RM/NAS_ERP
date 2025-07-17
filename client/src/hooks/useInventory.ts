// client/src/hooks/useInventory.ts (수정된 버전)
import { useQuery, useMutation } from '@tanstack/react-query';

import { inventoryApi } from '../services/api';
import { SearchFilters } from '../types';

export const useInventory = (
  page: number = 1,
  limit: number = 20,
  filters: SearchFilters = {}
) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    error,
    refetch
  } = useQuery(
    ['inventory', page, limit, filters],
    () => inventoryApi.getItems(page, limit, filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );

  return {
    items: data?.data?.items || [],
    total: data?.data?.total || 0,
    totalPages: data?.data?.totalPages || 0,
    hasNext: data?.data?.hasNext || false,
    hasPrev: data?.data?.hasPrev || false,
    stats: {
      totalItems: data?.data?.items?.length || 0,
      receivedItems: data?.data?.items?.filter(item => item.received)?.length || 0,
      pendingItems: data?.data?.items?.filter(item => !item.received)?.length || 0,
      totalValue: data?.data?.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0,
    },
    loading,
    error,
    refetch,
    invalidate: () => {
      queryClient.invalidateQueries('inventory');
    }
  };
};