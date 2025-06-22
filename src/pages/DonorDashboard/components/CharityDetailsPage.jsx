import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharities } from '../../../hooks/useCharities';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationCircleIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { FiArrowLeft } from 'react-icons/fi';

const CharityDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: charities = [], isLoading } = useCharities();
  const charity = charities.find(c => c._id === id);

  if (isLoading) return <div className="text-center py-12 text-lg text-gray-500">Loading...</div>;
  if (!charity) return <div className="text-center py-12 text-lg text-red-500">Charity not found.</div>;

  const isVerified = charity.isVerified || charity.verificationStatus === 'verified';
  const statusText = isVerified ? 'Verified' : (charity.verificationStatus || 'Pending');

  const handleDonateClick = () => {
    navigate('/donate', { state: { charityId: charity._id } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-4 left-4 bg-white border-1 border-black text-black rounded-full p-2 shadow hover:bg-gray-100 transition"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl font-bold font-sans text-black flex-1">{charity.charityName}</h2>
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} transition-colors`}>
            {isVerified ? <CheckCircleIcon className="h-5 w-5" /> : <ExclamationCircleIcon className="h-5 w-5" />}
            {statusText}
          </span>
        </div>
        {/* Category */}
        <div className="mb-3">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded font-medium uppercase tracking-wide">{charity.category}</span>
        </div>
        {/* Location */}
        <div className="flex items-start text-base text-gray-700 mb-3">
          <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span className="break-words">{charity.location?.address || charity.address}</span>
        </div>
        {/* Description */}
        {charity.description && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1 text-indigo-500 font-mono">About</h3>
            <p className="text-gray-700">{charity.description}</p>
          </div>
        )}
        {/* Charity Information */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 font-mono text-indigo-500">Charity Information</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 flex-shrink-0" />
              <span>{charity.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 flex-shrink-0" />
              <span>{charity.phoneNumber}</span>
            </div>
          </div>
        </div>
        {/* Priority Items */}
        {charity.priorityItems && charity.priorityItems.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1 text-ghibli-blue">Priority Items</h3>
            <div className="flex flex-wrap gap-2">
              {charity.priorityItems.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-ghibli-teal text-white text-xs px-3 py-1 rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Contact Info */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 font-mono text-indigo-500">Contact Person Information</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 flex-shrink-0" />
              <span>{charity.contactFirstName} {charity.contactLastName}</span>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 flex-shrink-0" />
              <span>{charity.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 flex-shrink-0" />
              <span>{charity.contactPhone}</span>
            </div>
          </div>
        </div>
        {/* Donate Button */}
        <div className="flex justify-center mt-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-20 py-2 rounded-full shadow transition"
            onClick={handleDonateClick}
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharityDetailsPage;
