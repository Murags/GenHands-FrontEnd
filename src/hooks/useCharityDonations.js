import { useQuery } from '@tanstack/react-query';
import donationService from '../services/donationService';
import { useMemo } from 'react';

/**
 * A custom hook to fetch and manage donations for a charity.
 * @param {object} [filters={}] - The filtering and pagination options.
 * @returns {object} The state and functions for managing charity donations.
 */
export const useCharityDonations = (filters = {}) => {
  const queryKey = ['charityDonations', filters];

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => donationService.getCharityDonations(filters),
    keepPreviousData: true, // Useful for pagination to keep showing old data while new data loads
  });

  // Memoize the destructured data to prevent unnecessary re-renders
  const { donations, pagination } = useMemo(() => {
    if (!response || !response.success) {
      return {
        donations: [],
        pagination: { count: 0, total: 0, pages: 0, currentPage: filters.page || 1 },
      };
    }
    return {
      donations: response.data,
      pagination: {
        count: response.count,
        total: response.total,
        pages: response.pages,
        currentPage: filters.page || 1,
      },
    };
  }, [response, filters.page]);

  return {
    donations,
    pagination,
    isLoading,
    isError,
    error,
    refetch,
  };
};
