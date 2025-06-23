import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import pickupRequestService from '../services/pickupRequestService';

export const useMyPickupHistory = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    // Default to only show completed pickups
    status: 'delivered',
    ...initialFilters,
  });

  const queryKey = ['myPickupHistory', filters];

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

  // Filter for completed pickups (delivered and cancelled)
  const completedPickups = data?.requests?.filter(pickup =>
    pickup.status === 'delivered' || pickup.status === 'cancelled'
  ) || [];

  return {
    // Data
    pickupHistory: completedPickups,
    allPickups: data?.requests || [],
    count: completedPickups.length,
    totalCount: data?.count || 0,

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

    // Helper methods
    getDeliveredPickups: () => completedPickups.filter(p => p.status === 'delivered'),
    getCancelledPickups: () => completedPickups.filter(p => p.status === 'cancelled'),
    getPickupsByDateRange: (startDate, endDate) => {
      return completedPickups.filter(pickup => {
        const pickupDate = new Date(pickup.updatedAt);
        return pickupDate >= new Date(startDate) && pickupDate <= new Date(endDate);
      });
    },
  };
};
