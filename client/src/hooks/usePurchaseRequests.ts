import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { purchaseApi } from '../services/api';
import { PurchaseRequest, SearchFilters } from '../types';

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
    staleTime: 5 * 60 * 1000
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
    totalPages: data?.totalPages || 0,
    totalItems: data?.totalItems || 0,
    loading: isLoading,
    error,
    refetch
  };
};