import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  TagIcon,
  GiftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useCategories } from '../../../hooks/useCategories';

const PublicCharityCard = ({ charity, onCharityClick, onDonateClick }) => {
  const { categories, isLoading: categoriesLoading } = useCategories();

  const isVerified = charity.isVerified || charity.verificationStatus === 'verified';
  const statusText = isVerified ? 'Verified' : (charity.verificationStatus || 'Pending');

  const getNeededCategoryNames = () => {
    if (!charity.neededCategories || !categories || categoriesLoading) {
      return [];
    }

    return charity.neededCategories
      .map(categoryId => {
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : null;
      })
      .filter(Boolean)
      .slice(0, 3);
  };

  const neededCategories = getNeededCategoryNames();
  const hasMoreCategories = charity.neededCategories && charity.neededCategories.length > 3;

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-ghibli p-6 hover:shadow-md transition-all duration-200 group border border-ghibli-brown-light flex flex-col h-96 border-l-8 ${
        isVerified ? 'border-l-ghibli-teal' : 'border-l-ghibli-yellow'
      }`}
      style={{ minHeight: '24rem' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl font-bold text-ghibli-dark-blue handwritten flex-1">
          {charity.charityName}
        </h2>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
          isVerified ? 'bg-ghibli-teal text-white' : 'bg-ghibli-yellow text-ghibli-dark-blue'
        } transition-colors`}>
          {isVerified ? <CheckCircleIcon className="h-4 w-4" /> : <ExclamationCircleIcon className="h-4 w-4" />}
          {statusText}
        </span>
      </div>

      {/* Category */}
      <div className="mb-2">
        <span className="inline-block bg-ghibli-blue text-white text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide shadow-sm">
          {charity.category}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-start text-sm text-ghibli-brown mb-3">
        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5 text-ghibli-teal" />
        <span className="whitespace-pre-line break-words">
          {charity.location?.address || charity.address}
        </span>
      </div>

      {/* Description */}
      {charity.description && (
        <div className="mb-3 flex-1">
          <p className="text-sm text-ghibli-brown line-clamp-3">
            {charity.description}
          </p>
        </div>
      )}

      {/* Needed Categories */}
      {charity.neededCategories && charity.neededCategories.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            <TagIcon className="h-4 w-4 text-ghibli-teal" />
            <span className="text-sm font-medium text-ghibli-dark-blue">Items Needed Most:</span>
          </div>

          {categoriesLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ghibli-teal"></div>
              <span className="text-xs text-ghibli-brown">Loading categories...</span>
            </div>
          ) : neededCategories.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {neededCategories.map((categoryName, idx) => (
                <span
                  key={idx}
                  className="bg-ghibli-blue text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm"
                >
                  {categoryName}
                </span>
              ))}
              {hasMoreCategories && (
                <span className="bg-ghibli-brown-light text-ghibli-brown text-xs px-2 py-1 rounded-full font-medium">
                  +{charity.neededCategories.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-ghibli-brown italic">Categories not found</span>
          )}
        </div>
      )}

      {/* Priority Items */}
      {charity.priorityItems && charity.priorityItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {charity.priorityItems.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className="bg-ghibli-red text-white text-xs px-2 py-1 rounded shadow-sm"
            >
              {item}
            </span>
          ))}
          {charity.priorityItems.length > 3 && (
            <span className="bg-ghibli-red-light text-ghibli-red text-xs px-2 py-1 rounded">
              +{charity.priorityItems.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Contact Info */}
      <div className="flex flex-col gap-1 text-xs text-ghibli-brown mt-auto mb-4">
        <div className="flex items-center gap-1">
          <UserIcon className="h-4 w-4 flex-shrink-0 text-ghibli-teal" />
          <span className="truncate">
            {charity.contactFirstName} {charity.contactLastName}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <EnvelopeIcon className="h-4 w-4 flex-shrink-0 text-ghibli-teal" />
          <span className="truncate">{charity.contactEmail}</span>
        </div>
        {(charity.contactPhone || charity.phoneNumber) && (
          <div className="flex items-center gap-1">
            <PhoneIcon className="h-4 w-4 flex-shrink-0 text-ghibli-teal" />
            <span className="truncate">{charity.contactPhone || charity.phoneNumber}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCharityClick();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-ghibli-teal text-ghibli-teal rounded-lg hover:bg-ghibli-teal hover:text-white transition-colors text-sm font-medium"
        >
          <EyeIcon className="h-4 w-4" />
          View Details
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDonateClick();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium shadow-sm"
        >
          <GiftIcon className="h-4 w-4" />
          Donate
        </button>
      </div>
    </div>
  );
};

export default PublicCharityCard;
