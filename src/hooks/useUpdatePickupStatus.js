import { useMutation, useQueryClient } from '@tanstack/react-query';
import pickupRequestService from '../services/pickupRequestService';
import toast from 'react-hot-toast';

export const useUpdatePickupStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pickupId, status }) => pickupRequestService.updatePickupStatus(pickupId, status),
    onSuccess: () => {
      toast.success('Pickup status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['pickupRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myPickups'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update pickup status.');
    },
  });
};
