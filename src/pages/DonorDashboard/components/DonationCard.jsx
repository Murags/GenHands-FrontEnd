import React, { useState } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import { UserIcon, TruckIcon, ExclamationTriangleIcon, XMarkIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Modal from '../../../components/Modal';

const DonationCard = ({ donation }) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const getCategoryName = (categoryId) => {
    if (!categories || categoriesLoading) {
      return 'Loading...';
    }

    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  const getStatusInfo = (status) => {
    const statusLower = (status || '').toLowerCase().trim();
    switch (statusLower) {
      case 'delivered':
        return { color: 'bg-ghibli-teal text-white', text: 'Delivered' };
      case 'assigned':
        return { color: 'bg-ghibli-blue text-white', text: 'Assigned' };
      case 'submitted':
        return { color: 'bg-ghibli-yellow text-ghibli-dark-blue', text: 'Submitted' };
      case 'cancelled':
      case 'canceled':
        return { color: 'bg-ghibli-red text-white', text: 'Cancelled' };
      default:
        return { color: 'bg-ghibli-brown text-white', text: 'Pending' };
    }
  };

  const canCancel = () => {
    const status = (donation.status || '').toLowerCase().trim();
    return status === 'submitted' || status === 'pending' || !status;
  };

  const handleCancelDonation = async () => {
    setIsCancelling(true);
    try {
      // TODO: Implement actual API call to cancel donation
      // await cancelDonation(donation._id);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Donation cancelled successfully');
      setShowCancelModal(false);

      // TODO: Refresh donations list or update the donation status
      // This would typically be handled by updating the parent component's state

    } catch (error) {
      toast.error('Failed to cancel donation. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const statusInfo = getStatusInfo(donation.status);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-ghibli p-6 flex flex-col justify-between border border-ghibli-brown-light hover:shadow-lg transition-all duration-200" style={{ minHeight: '28rem' }}>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-bold text-ghibli-dark-blue handwritten">
              {donation.organizationName || 'Charity'}
            </h2>
            {donation.organizationType && (
              <span className="bg-ghibli-blue text-white text-xs font-semibold px-2 py-0.5 rounded uppercase shadow-sm">
                {donation.organizationType}
              </span>
            )}
          </div>

          {/* Donated On */}
          <div className="text-xs text-ghibli-brown mb-3">
            <span className="font-semibold">Donated on:</span> {new Date(donation.createdAt).toLocaleDateString()}
          </div>

          {/* Pickup Assignment Info */}
          {donation.assignedVolunteer && (
            <div className="mb-3 p-3 bg-ghibli-cream-lightest rounded-lg border border-ghibli-brown-light">
              <div className="flex items-center gap-2 mb-2">
                <TruckIcon className="h-4 w-4 text-ghibli-teal" />
                <span className="text-sm font-semibold text-ghibli-dark-blue">Assigned Volunteer</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-ghibli-brown">
                  <UserIcon className="h-3 w-3 text-ghibli-teal" />
                  <span>{donation.assignedVolunteer.name}</span>
                </div>
                {donation.assignedVolunteer.phone && (
                  <div className="flex items-center gap-2 text-xs text-ghibli-brown">
                    <PhoneIcon className="h-3 w-3 text-ghibli-teal" />
                    <span>{donation.assignedVolunteer.phone}</span>
                  </div>
                )}
                {donation.assignedVolunteer.email && (
                  <div className="flex items-center gap-2 text-xs text-ghibli-brown">
                    <EnvelopeIcon className="h-3 w-3 text-ghibli-teal" />
                    <span>{donation.assignedVolunteer.email}</span>
                  </div>
                )}
                {donation.estimatedPickupTime && (
                  <div className="text-xs text-ghibli-brown mt-1">
                    <span className="font-semibold">Estimated pickup:</span> {new Date(donation.estimatedPickupTime).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="mb-3">
            <span className="font-semibold text-sm text-ghibli-dark-blue">Items:</span>
            <ul className="list-disc ml-5 text-sm text-ghibli-brown mt-1">
              {donation.donationItems?.map((item, idx) => (
                <li key={idx}>
                  {item.quantity} x {getCategoryName(item.category)}
                  {item.description && ` - ${item.description}`}
                  {item.condition && (
                    <span className="ml-2 text-xs text-ghibli-brown opacity-70">({item.condition})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Pickup Address */}
          <div className="text-xs text-ghibli-brown mb-2">
            <span className="font-semibold">Pickup Address:</span> {donation.pickupAddress}
          </div>

          {/* Access Notes */}
          {donation.accessNotes && (
            <div className="text-xs text-ghibli-brown mb-2">
              <span className="font-semibold">Access Notes:</span> {donation.accessNotes}
            </div>
          )}

          {/* Delivery Instructions */}
          {donation.deliveryInstructions && (
            <div className="text-xs text-ghibli-brown mb-2">
              <span className="font-semibold">Delivery Instructions:</span> {donation.deliveryInstructions}
            </div>
          )}

          {/* Additional Notes */}
          {donation.additionalNotes && (
            <div className="text-xs text-ghibli-brown mb-3">
              <span className="font-semibold">Additional Notes:</span> {donation.additionalNotes}
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {donation.requiresRefrigeration && (
              <span className="bg-ghibli-blue text-white px-2 py-0.5 rounded text-xs shadow-sm">Refrigeration</span>
            )}
            {donation.fragileItems && (
              <span className="bg-ghibli-yellow text-ghibli-dark-blue px-2 py-0.5 rounded text-xs shadow-sm">Fragile</span>
            )}
            {donation.urgencyLevel && (
              <span className="bg-ghibli-red text-white px-2 py-0.5 rounded text-xs shadow-sm capitalize">{donation.urgencyLevel} urgency</span>
            )}
          </div>
        </div>

        {/* Status, Weight, and Actions */}
        <div className="space-y-3 mt-4 pt-3 border-t border-ghibli-brown-light">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
            {donation.totalWeight && (
              <span className="text-xs text-ghibli-brown">{donation.totalWeight} kg</span>
            )}
          </div>

          {/* Cancel Button */}
          {canCancel() && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-ghibli-red text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium shadow-sm"
            >
              <XMarkIcon className="h-4 w-4" />
              Cancel Donation
            </button>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Donation"
        subtitle="Are you sure you want to cancel this donation?"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-ghibli-red bg-opacity-10 rounded-lg border border-ghibli-red border-opacity-20">
            <ExclamationTriangleIcon className="h-6 w-6 text-ghibli-red flex-shrink-0" />
            <div className="text-sm text-ghibli-brown">
              <p className="font-medium text-ghibli-dark-blue mb-1">This action cannot be undone</p>
              <p>Your donation will be cancelled and removed from the charity's incoming donations list.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-2 text-ghibli-brown bg-ghibli-cream-lightest rounded-lg hover:bg-ghibli-brown hover:text-white transition-colors"
              disabled={isCancelling}
            >
              Keep Donation
            </button>
            <button
              onClick={handleCancelDonation}
              disabled={isCancelling}
              className="flex-1 px-4 py-2 bg-ghibli-red text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Donation'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DonationCard;
