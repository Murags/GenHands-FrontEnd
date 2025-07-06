import { useQuery } from '@tanstack/react-query';
import pickupRequestService from '../services/pickupRequestService';

export const usePickupRequests = (filters = {}) => {
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
    enabled: true, // Always enabled, but will refetch when filters change
  });

  return {
    requests: data?.requests || [],
    requestCount: data?.count || 0,

    isLoading,
    isError,
    error,
    isFetching,

    refetch,
  };
};
