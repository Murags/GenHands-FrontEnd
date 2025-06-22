import { useMutation, useQueryClient } from '@tanstack/react-query';
import donationService from '../services/donationService';
import toast from 'react-hot-toast';

export const useDonationConfirmation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ donationId, thankYouNote }) =>
      donationService.confirmDonation(donationId, thankYouNote),

    onSuccess: (data) => {
      toast.success('Donation confirmed successfully! Thank you note sent to donor.');

      // Invalidate and refetch charity donations to update the UI
      queryClient.invalidateQueries({ queryKey: ['charityDonations'] });
    },

    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to confirm donation';
      toast.error(errorMessage);
    },
  });
};
