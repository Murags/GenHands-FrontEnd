import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ExclamationCircleIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

const CharityCard = ({ charity }) => {
  const navigate = useNavigate();
  const isVerified = charity.isVerified || charity.verificationStatus === 'verified';
  const statusText = isVerified ? 'Verified' : (charity.verificationStatus || 'Pending');

  const handleCardClick = () => {
    navigate(`/charityDetails/${charity._id}`);
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition group border border-gray-100 flex flex-col h-80"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
      aria-label={`View details for ${charity.charityName}`}
      style={{ minHeight: '20rem' }}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-full w-2 rounded-l-2xl ${isVerified ? 'bg-indigo-500' : 'bg-yellow-400'} transition-colors`} />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl font-bold text-black font-sans">{charity.charityName}</h2>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} transition-colors`}>
          {isVerified ? <CheckCircleIcon className="h-4 w-4" /> : <ExclamationCircleIcon className="h-4 w-4" />}
          {statusText}
        </span>
      </div>
      {/* Category */}
      <div className="mb-2">
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded font-medium font-sans uppercase tracking-wide">{charity.category}</span>
      </div>
      {/* Location */}
      <div className="flex items-start text-sm text-gray-600 mb-2">
        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
        <span className="whitespace-pre-line break-words">{charity.location?.address || charity.address}</span>
      </div>
      {/* Priority Items */}
      {charity.priorityItems && charity.priorityItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {charity.priorityItems.map((item, idx) => (
            <span
              key={idx}
              className="bg-ghibli-teal text-white text-xs px-2 py-1 rounded"
            >
              {item}
            </span>
          ))}
        </div>
      )}
      {/* Contact Info */}
      <div className="flex flex-col gap-1 text-xs text-gray-500 mt-auto">
        <div className="flex items-center gap-1">
          <UserIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{charity.contactFirstName} {charity.contactLastName}</span>
        </div>
        <div className="flex items-center gap-1">
          <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{charity.contactEmail}</span>
        </div>
        <div className="flex items-center gap-1">
          <PhoneIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{charity.contactPhone || charity.phoneNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default CharityCard;
