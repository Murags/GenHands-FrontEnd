import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ExclamationCircleIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';
import { useCategories } from '../../../hooks/useCategories';

const CharityCard = ({ charity }) => {
  const navigate = useNavigate();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const isVerified = charity.isVerified || charity.verificationStatus === 'verified';
  const statusText = isVerified ? 'Verified' : (charity.verificationStatus || 'Pending');

  const handleCardClick = () => {
    navigate(`/charityDetails/${charity._id}`);
  };

  const getNeededCategoryNames = () => {
    if (!charity.neededCategories || !categories || categoriesLoading) {
      return [];
    }

    return charity.neededCategories
      .map(categoryId => {
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : null;
      })
      .filter(Boolean) // Remove null values
      .slice(0, 3); // Show max 3 categories
  };

  const neededCategories = getNeededCategoryNames();
  const hasMoreCategories = charity.neededCategories && charity.neededCategories.length > 3;

  return (
    <div
      className="relative bg-white rounded-2xl shadow-ghibli p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group border border-ghibli-brown-light flex flex-col h-96"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
      aria-label={`View details for ${charity.charityName}`}
      style={{ minHeight: '24rem' }}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-full w-2 rounded-l-2xl ${isVerified ? 'bg-ghibli-teal' : 'bg-ghibli-yellow'} transition-colors`} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl font-bold text-ghibli-dark-blue handwritten">{charity.charityName}</h2>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${isVerified ? 'bg-ghibli-teal text-white' : 'bg-ghibli-yellow text-ghibli-dark-blue'} transition-colors`}>
          {isVerified ? <CheckCircleIcon className="h-4 w-4" /> : <ExclamationCircleIcon className="h-4 w-4" />}
          {statusText}
        </span>
      </div>

      {/* Category */}
      <div className="mb-2">
        <span className="inline-block bg-ghibli-blue text-white text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide shadow-sm">{charity.category}</span>
      </div>

      {/* Location */}
      <div className="flex items-start text-sm text-ghibli-brown mb-3">
        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5 text-ghibli-teal" />
        <span className="whitespace-pre-line break-words">{charity.location?.address || charity.address}</span>
      </div>

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

      {charity.priorityItems && charity.priorityItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {charity.priorityItems.map((item, idx) => (
            <span
              key={idx}
              className="bg-ghibli-red text-white text-xs px-2 py-1 rounded shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Contact Info */}
      <div className="flex flex-col gap-1 text-xs text-ghibli-brown mt-auto">
        <div className="flex items-center gap-1">
          <UserIcon className="h-4 w-4 flex-shrink-0 text-ghibli-teal" />
          <span className="truncate">{charity.contactFirstName} {charity.contactLastName}</span>
        </div>
        <div className="flex items-center gap-1">
          <EnvelopeIcon className="h-4 w-4 flex-shrink-0 text-ghibli-teal" />
          <span className="truncate">{charity.contactEmail}</span>
        </div>
        <div className="flex items-center gap-1">
          <PhoneIcon className="h-4 w-4 flex-shrink-0 text-ghibli-teal" />
          <span className="truncate">{charity.contactPhone || charity.phoneNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default CharityCard;
