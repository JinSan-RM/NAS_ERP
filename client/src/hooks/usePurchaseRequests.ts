// client/src/hooks/usePurchaseRequests.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { purchaseApi } from '../services/api';
import { PurchaseRequest, SearchFilters } from '../types';

interface PurchaseRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisMonth: number;
}

export const usePurchaseRequests = (page: number, limit: number, filters: SearchFilters = {}) => {
  const queryClient = useQueryClient();

  const queryKey = ['purchase-requests', page, limit, filters];

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => purchaseApi.getRequests({ page, limit, ...filters }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // 통계 데이터 조회
  const { data: statsData } = useQuery({
    queryKey: ['purchase-requests-stats'],
    queryFn: () => purchaseApi.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (data?.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['purchase-requests', page + 1, limit, filters],
        queryFn: () => purchaseApi.getRequests({ page: page + 1, limit, ...filters })
      });
    }
  }, [data, page, limit, filters, queryClient]);

  return {
    requests: data?.items || [],
    totalPages: data?.pages || 0,
    totalItems: data?.total || 0,
    stats: statsData?.data || {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      thisMonth: 0,
    } as PurchaseRequestStats,
    loading: isLoading,
    error,
    refetch
  };
};

