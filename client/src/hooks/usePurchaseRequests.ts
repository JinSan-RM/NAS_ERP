// client/src/hooks/usePurchaseRequests.ts (수정된 버전)
import { useQuery, useQueryClient } from 'react-query';
import { purchaseApi } from '../services/api';
import { SearchFilters } from '../types';

export const usePurchaseRequests = (
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
    ['purchase-requests', page, limit, filters],
    () => purchaseApi.getRequests(page, limit, filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );

  // 통계 데이터 조회
  const { data: statsData } = useQuery(
    ['purchase-requests-stats'],
    () => purchaseApi.getStats(),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  return {
    requests: data?.data?.items || [],
    total: data?.data?.total || 0,
    totalPages: data?.data?.totalPages || 0,
    hasNext: data?.data?.hasNext || false,
    hasPrev: data?.data?.hasPrev || false,
    stats: statsData?.data || {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      thisMonth: 0,
      lastMonth: 0,
    },
    loading,
    error,
    refetch,
    invalidate: () => {
      queryClient.invalidateQueries('purchase-requests');
      queryClient.invalidateQueries('purchase-requests-stats');
    }
  };
};