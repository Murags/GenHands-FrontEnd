import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import pickupRequestService from '../services/pickupRequestService';

export const usePickupRequests = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const queryKey = ['pickupRequests', filters];

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => pickupRequestService.getPickupRequests(filters),
    keepPreviousData: true,
  });

  return {
    requests: data?.requests || [],
    requestCount: data?.count || 0,

    isLoading,
    isError,
    error,
    isFetching,

    filters,
    setFilters,

    refetch,
  };
};
