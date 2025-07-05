import React, { useState } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import {
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  GiftIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const ThankYouNotesView = ({ donations, isLoading }) => {
  const { categories = [] } = useCategories();
  const [sortBy, setSortBy] = useState('newest');

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  const donationsWithThankYou = donations.filter(donation =>
    donation.thankYouNote && donation.thankYouNote.trim()
  );

  const sortedDonations = [...donationsWithThankYou].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.confirmedAt || a.createdAt) - new Date(b.confirmedAt || b.createdAt);
      case 'charity':
        return (a.charityName || '').localeCompare(b.charityName || '');
      case 'newest':
      default:
        return new Date(b.confirmedAt || b.createdAt) - new Date(a.confirmedAt || a.createdAt);
    }
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghibli-teal"></div>
        </div>
        <p className="text-ghibli-brown text-lg">Loading thank you notes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ghibli-dark-blue handwritten mb-2">
            Thank You Notes
          </h2>
          <p className="text-ghibli-brown">
            Heartfelt messages from charities who received your donations
          </p>
        </div>

        {donationsWithThankYou.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="cursor-pointer text-sm text-ghibli-brown">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer px-3 py-2 rounded-lg border border-ghibli-brown-light bg-white focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="charity">Charity Name</option>
            </select>
          </div>
        )}
      </div>

      {donationsWithThankYou.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-8">
            <ChatBubbleLeftEllipsisIcon className="h-16 w-16 text-ghibli-brown-light mx-auto mb-4" />
            <p className="text-ghibli-brown text-lg mb-4">No thank you notes yet.</p>
            <p className="text-ghibli-brown text-sm">
              Charities will send thank you messages once they receive and confirm your donations.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedDonations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="cursor-pointer bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-ghibli-teal-lightest rounded-full flex items-center justify-center">
                    <HeartIcon className="h-6 w-6 text-ghibli-teal" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ghibli-dark-blue text-lg">
                      {donation.charityName}
                    </h3>
                    <p className="text-sm text-ghibli-brown">
                      {new Date(donation.confirmedAt || donation.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <span className="bg-ghibli-green text-white px-3 py-1 rounded-full text-xs font-medium">
                  Confirmed
                </span>
              </div>

              <div className="mb-4 p-4 bg-ghibli-cream-lightest rounded-lg border-l-4 border-ghibli-teal">
                <div className="flex items-start gap-2 mb-2">
                  <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-ghibli-teal mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-ghibli-dark-blue text-sm">Thank You Message:</span>
                </div>
                <p className="text-ghibli-dark-blue italic leading-relaxed">
                  "{donation.thankYouNote}"
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <GiftIcon className="h-4 w-4 text-ghibli-teal" />
                  <span className="font-medium text-ghibli-dark-blue">Donation ID:</span>
                  <span className="text-ghibli-brown font-mono">{donation.id}</span>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <TagIcon className="h-4 w-4 text-ghibli-teal mt-0.5" />
                  <div>
                    <span className="font-medium text-ghibli-dark-blue">Items:</span>
                    <ul className="mt-1 space-y-1">
                      {donation.donationItems?.map((item, idx) => (
                        <li key={idx} className="text-ghibli-brown ml-2">
                          • {item.quantity} x {getCategoryName(item.category)}
                          {item.description && ` - ${item.description}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {donation.totalWeight && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 flex items-center justify-center">
                      <span className="text-ghibli-teal font-bold">⚖</span>
                    </span>
                    <span className="font-medium text-ghibli-dark-blue">Weight:</span>
                    <span className="text-ghibli-brown">{donation.totalWeight}</span>
                  </div>
                )}

                <div className="flex items-start gap-2 text-sm">
                  <BuildingOfficeIcon className="h-4 w-4 text-ghibli-teal mt-0.5" />
                  <div>
                    <span className="font-medium text-ghibli-dark-blue">Pickup Location:</span>
                    <p className="text-ghibli-brown mt-1">{donation.pickupAddress}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {donationsWithThankYou.length > 0 && (
        <div className="cursor-pointer bg-ghibli-cream-lightest rounded-xl p-6 border border-ghibli-brown-light">
          <div className="flex items-center gap-3 mb-3">
            <HeartIcon className="h-6 w-6 text-ghibli-teal" />
            <h3 className="font-bold text-ghibli-dark-blue">Your Impact</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-ghibli-teal">
                {donationsWithThankYou.length}
              </div>
              <div className="text-sm text-ghibli-brown">Thank You Notes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ghibli-teal">
                {new Set(donationsWithThankYou.map(d => d.charityName)).size}
              </div>
              <div className="text-sm text-ghibli-brown">Charities Helped</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ghibli-teal">
                {donationsWithThankYou.reduce((total, d) =>
                  total + (d.donationItems?.length || 0), 0
                )}
              </div>
              <div className="text-sm text-ghibli-brown">Items Donated</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThankYouNotesView;
