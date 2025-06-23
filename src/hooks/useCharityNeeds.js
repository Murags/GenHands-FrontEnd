import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import charityNeedsService from '../services/charityNeedsService';

export const useCharityNeeds = () => {
  const queryClient = useQueryClient();

  const queryKey = ['charity-needs'];

  // Query to get the charity's needs list
  const {
    data: charityNeeds,
    isLoading: isLoadingNeeds,
    isError: isErrorNeeds,
    refetch: refetchNeeds,
  } = useQuery({
    queryKey,
    queryFn: charityNeedsService.getCharityNeeds,
    retry: 1,
    // The API might return a 404 if no needs are set, treat this as a non-error state (null data)
    onError: (error) => {
      if (error.response && error.response.status === 404) {
        return null;
      }
    },
  });

  // Mutation to set or update the needs list
  const { mutate: setNeeds, isPending: isSettingNeeds } = useMutation({
    mutationFn: charityNeedsService.setCharityNeeds,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data); // Optimistically update the cache
      queryClient.invalidateQueries({ queryKey });
      toast.success('Your needs list has been updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update needs list.';
      toast.error(`Error: ${message}`);
    },
  });

  // Mutation to clear the needs list
  const { mutate: clearNeeds, isPending: isClearingNeeds } = useMutation({
    mutationFn: charityNeedsService.clearCharityNeeds,
    onSuccess: () => {
      queryClient.setQueryData(queryKey, null); // Clear the cache
      queryClient.invalidateQueries({ queryKey });
      toast.success('Your needs list has been cleared.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to clear needs list.';
      toast.error(`Error: ${message}`);
    },
  });

  return {
    // Data
    charityNeeds,

    // Loading states
    isLoadingNeeds,
    isSettingNeeds,
    isClearingNeeds,

    // Error state
    isErrorNeeds,

    // Actions
    setNeeds,
    clearNeeds,
    refetchNeeds,
  };
};
