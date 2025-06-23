import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import pickupRequestService from '../services/pickupRequestService';

export const useMyPickups = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const queryKey = ['myPickups', filters];

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => pickupRequestService.getMyPickups(filters),
    keepPreviousData: true,
  });

  return {
    // Data
    myPickups: data?.requests || [],
    count: data?.count || 0,

    // Query states
    isLoading,
    isError,
    error,
    isFetching,

    // Filters
    filters,
    setFilters,

    // Actions
    refetch,
  };
};
