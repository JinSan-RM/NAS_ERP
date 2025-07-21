// client/src/hooks/useInventory.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../services/api';
import { SearchFilters } from '../types';

interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}

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
  } = useQuery({
    queryKey: ['inventory', page, limit, filters],
    queryFn: () => inventoryApi.getItems(page, limit, filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  // 통계 데이터 조회
  const { data: statsData } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => inventoryApi.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  const items = data?.data?.items || [];
  const totalPages = data?.data?.pages || 0;
  const total = data?.data?.total || 0;
  const stats = statsData?.data || {};

  return {
    items,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    stats: {
      totalItems: stats.total_items || items.length,
      lowStockItems: stats.low_stock_items || 0,
      outOfStockItems: stats.out_of_stock_items || 0,
      totalValue: stats.total_value || 0,
    } as InventoryStats,
    loading,
    error,
    refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
    }
  };
};