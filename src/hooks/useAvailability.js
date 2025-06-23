import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import availabilityService from '../services/availabilityService';

export const useAvailability = () => {
  const queryClient = useQueryClient();

  // Get current user's availability
  const {
    data: myAvailability,
    isLoading: isLoadingAvailability,
    isError: isErrorAvailability,
    refetch: refetchAvailability
  } = useQuery({
    queryKey: ['my-availability'],
    queryFn: availabilityService.getMyAvailability,
    retry: 1,
  });

  // Unavailability periods are part of the main availability object
  const unavailabilityPeriods = myAvailability?.temporaryUnavailability || [];
  const isLoadingUnavailability = isLoadingAvailability;

  // Set/Update availability mutation
  const { mutate: setAvailability, isPending: isSettingAvailability } = useMutation({
    mutationFn: availabilityService.setAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      toast.success('Availability updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Failed to update availability';
      toast.error(`Error updating availability: ${message}`);
    },
  });

  // Delete availability mutation
  const { mutate: deleteAvailability, isPending: isDeletingAvailability } = useMutation({
    mutationFn: availabilityService.deleteAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      toast.success('Availability deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Failed to delete availability';
      toast.error(`Error deleting availability: ${message}`);
    },
  });

  // Add unavailability mutation
  const { mutate: addUnavailability, isPending: isAddingUnavailability } = useMutation({
    mutationFn: availabilityService.addUnavailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      toast.success('Unavailability period added successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Failed to add unavailability';
      toast.error(`Error adding unavailability: ${message}`);
    },
  });

  // Remove unavailability mutation
  const { mutate: removeUnavailability, isPending: isRemovingUnavailability } = useMutation({
    mutationFn: availabilityService.removeUnavailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      toast.success('Unavailability period removed successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Failed to remove unavailability';
      toast.error(`Error removing unavailability: ${message}`);
    },
  });

  // Check availability mutation (doesn't need query invalidation)
  const { mutate: checkAvailability, isPending: isCheckingAvailability } = useMutation({
    mutationFn: availabilityService.checkAvailability,
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Failed to check availability';
      toast.error(`Error checking availability: ${message}`);
    },
  });

  return {
    // Data
    myAvailability,
    unavailabilityPeriods,

    // Loading states
    isLoadingAvailability,
    isLoadingUnavailability,
    isSettingAvailability,
    isDeletingAvailability,
    isAddingUnavailability,
    isRemovingUnavailability,
    isCheckingAvailability,

    // Error states
    isErrorAvailability,

    // Actions
    setAvailability,
    deleteAvailability,
    addUnavailability,
    removeUnavailability,
    checkAvailability,
    refetchAvailability,
  };
};

// Helper hook for availability checking
export const useAvailabilityChecker = () => {
  const { mutateAsync: checkAvailability, isPending, data, error } = useMutation({
    mutationFn: availabilityService.checkAvailability,
  });

  const checkAvailabilityAtTime = async (dateTime) => {
    try {
      const result = await checkAvailability({ dateTime });
      return result;
    } catch (err) {
      throw err;
    }
  };

  return {
    checkAvailabilityAtTime,
    isChecking: isPending,
    checkResult: data,
    checkError: error,
  };
};
