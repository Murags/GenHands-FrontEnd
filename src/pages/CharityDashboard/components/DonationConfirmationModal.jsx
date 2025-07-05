import React, { useState } from 'react';
import {
  CheckCircleIcon,
  HeartIcon,
  UserIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';
import { useDonationConfirmation } from '../../../hooks/useDonationConfirmation';
import Modal from '../../../components/Modal';

const DonationConfirmationModal = ({ donation, isOpen, onClose }) => {
  const [thankYouNote, setThankYouNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: confirmDonation } = useDonationConfirmation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thankYouNote.trim()) {
      return;
    }

    setIsSubmitting(true);

    confirmDonation(
      { donationId: donation._id, thankYouNote: thankYouNote.trim() },
      {
        onSuccess: () => {
          setThankYouNote('');
          setIsSubmitting(false);
          onClose();
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setThankYouNote('');
      onClose();
    }
  };

  if (!donation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Confirm Donation Receipt"
      subtitle="Send a thank you note to the generous donor"
      size="large"
      closeOnBackdropClick={!isSubmitting}
    >
      {/* Donation Details */}
      <div className="p-4 mb-6 bg-ghibli-cream-lightest rounded-lg border border-ghibli-brown-light">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-ghibli-teal rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-ghibli-dark-blue mb-1">
              {donation.donorName || donation.donorId?.name || 'Anonymous Donor'}
            </h3>
            {donation.donorId?.email && (
              <p className="text-sm text-ghibli-brown mb-3">{donation.donorId.email}</p>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <GiftIcon className="h-4 w-4 text-ghibli-blue" />
                <span className="text-sm font-medium text-ghibli-dark-blue">Donated Items:</span>
              </div>
              <div className="ml-6 space-y-1">
                {donation.donationItems?.map((item, index) => (
                  <div key={item._id || index} className="text-sm text-ghibli-brown">
                    • {item.description} - {item.quantity} ({item.condition})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Note Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <HeartIcon className="h-5 w-5 text-ghibli-red" />
            <label className="text-lg font-semibold text-ghibli-dark-blue">
              Your Thank You Message
            </label>
          </div>
          <p className="text-sm text-ghibli-brown mb-4">
            Express your gratitude to the donor. This message will be sent to them via email
            to let them know their donation was received and appreciated.
          </p>

          <textarea
            value={thankYouNote}
            onChange={(e) => setThankYouNote(e.target.value)}
            placeholder="Dear generous donor,

Thank you so much for your wonderful donation! Your kindness and generosity make a real difference in our community. The items you donated will help us continue our mission to support those in need.

We are incredibly grateful for your support and hope you know how much your contribution means to our organization and the people we serve.

With heartfelt appreciation,
[Your Organization Name]"
            className="w-full h-40 px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent resize-none"
            disabled={isSubmitting}
            required
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-ghibli-brown">
              {thankYouNote.length} characters
            </span>
            <span className="text-xs text-ghibli-brown">
              Minimum 50 characters recommended
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ghibli-brown-light">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="cursor-pointer px-6 py-2 text-ghibli-brown border border-ghibli-brown-light rounded-lg hover:bg-ghibli-cream-lightest transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !thankYouNote.trim()}
            className="cursor-pointer px-6 py-2 bg-ghibli-green text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4" />
                <span>Confirm & Send Thank You</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DonationConfirmationModal;
