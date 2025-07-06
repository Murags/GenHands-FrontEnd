import React, { useState } from 'react';
import {
  HeartIcon,
  CalendarIcon,
  UserIcon,
  GiftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useCharityDonations } from '../../../hooks/useCharityDonations';
import DonationConfirmationModal from './DonationConfirmationModal';

const ThankYouNotes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    donation: null,
  });

  const { donations, pagination, isLoading, isError, refetch } = useCharityDonations({
    status: 'delivered',
    page: currentPage,
    limit: 10,
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const openConfirmationModal = (donation) => {
    setConfirmationModal({
      isOpen: true,
      donation,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      donation: null,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghibli-blue"></div>
          <span className="ml-3 text-ghibli-brown">Loading delivered donations...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-center py-8">
          <ExclamationTriangleIcon className="h-8 w-8 text-ghibli-red mr-3" />
          <div>
            <p className="text-ghibli-red font-medium">Failed to load delivered donations</p>
            <button
              onClick={() => refetch()}
              className="cursor-pointer text-ghibli-blue hover:text-ghibli-dark-blue text-sm font-medium mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-ghibli-red bg-opacity-20 rounded-lg">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-ghibli-dark-blue handwritten">
                Thank You Notes
              </h2>
              <p className="text-ghibli-brown mt-1">
                Send heartfelt gratitude to donors whose items have been delivered
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => refetch()}
              className="cursor-pointer p-2 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors rounded-lg hover:bg-ghibli-cream-lightest"
              title="Refresh"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <div className="bg-ghibli-red text-white px-4 py-2 rounded-full text-sm font-medium">
              {pagination.total} Awaiting Thank You
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-ghibli-red-light to-ghibli-red bg-opacity-10 rounded-xl border border-ghibli-red-light p-6">
        <div className="flex items-start space-x-3">
          <HeartIcon className="h-6 w-6 text-ghibli-red flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-ghibli-dark-blue mb-2">Express Your Gratitude</h3>
            <p className="text-white text-sm leading-relaxed">
              These donations have been successfully delivered to your organization. Take a moment to send
              personalized thank you notes to show your appreciation to these generous donors. Your gratitude
              helps build lasting relationships and encourages continued support.
            </p>
          </div>
        </div>
      </div>

      {/* Delivered Donations List */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="p-6 border-b border-ghibli-brown-light">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ghibli-dark-blue">
              Delivered Donations ({pagination.total})
            </h3>
            <span className="text-sm text-ghibli-brown">
              Showing {pagination.count} of {pagination.total} donations
            </span>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircleIcon className="h-16 w-16 text-ghibli-green mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ghibli-dark-blue mb-2">
              All Caught Up! 🎉
            </h3>
            <p className="text-ghibli-brown">
              You've sent thank you notes for all delivered donations. Great job expressing gratitude!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-ghibli-brown-light">
            {donations.map((donation) => (
              <div key={donation._id} className="p-6 hover:bg-ghibli-cream-lightest transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Donor Info */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-ghibli-teal rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ghibli-dark-blue">
                          {donation.donorName || donation.donorId?.name || 'Anonymous Donor'}
                        </h4>
                        {donation.donorId?.email && (
                          <p className="text-sm text-ghibli-brown">{donation.donorId.email}</p>
                        )}
                      </div>
                      <div className="px-3 py-1 bg-ghibli-green text-white rounded-full text-xs font-medium flex items-center space-x-1">
                        <CheckCircleIcon className="h-3 w-3" />
                        <span>Delivered</span>
                      </div>
                    </div>

                    {/* Donation Items */}
                    <div className="mb-3">
                      <h5 className="font-medium text-ghibli-dark-blue mb-2 flex items-center space-x-2">
                        <GiftIcon className="h-4 w-4 text-ghibli-blue" />
                        <span>Donated Items:</span>
                      </h5>
                      <div className="space-y-2">
                        {donation.donationItems?.map((item, index) => (
                          <div key={item._id || index} className="flex items-center space-x-3 text-sm">
                            <span className="px-2 py-1 bg-ghibli-blue bg-opacity-10 text-ghibli-blue rounded-full text-xs font-medium">
                              {item.category?.name || 'Uncategorized'}
                            </span>
                            <span className="text-ghibli-brown">
                              {item.description} - {item.quantity} ({item.condition})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center space-x-6 text-sm text-ghibli-brown">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Submitted: {formatDate(donation.createdAt)}</span>
                      </div>
                      {donation.updatedAt !== donation.createdAt && (
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-ghibli-green" />
                          <span>Delivered: {formatDate(donation.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-6">
                    <button
                      onClick={() => openConfirmationModal(donation)}
                      className="cursor-pointer px-6 py-3 bg-ghibli-red text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2 shadow-sm"
                    >
                      <HeartIcon className="h-4 w-4" />
                      <span>Send Thank You</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-6 border-t border-ghibli-brown-light">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ghibli-brown">
                Page {pagination.currentPage} of {pagination.pages}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="cursor-pointer flex items-center space-x-1 px-3 py-2 text-ghibli-brown border border-ghibli-brown-light rounded-lg hover:bg-ghibli-cream-lightest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="cursor-pointer h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.pages}
                  className="cursor-pointer flex items-center space-x-1 px-3 py-2 text-ghibli-brown border border-ghibli-brown-light rounded-lg hover:bg-ghibli-cream-lightest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRightIcon className="cursor-pointer h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <DonationConfirmationModal
        donation={confirmationModal.donation}
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
      />
    </div>
  );
};

export default ThankYouNotes;
