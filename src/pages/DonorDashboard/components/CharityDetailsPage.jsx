import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharities } from '../../../hooks/useCharities';
import { useCategories } from '../../../hooks/useCategories';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  TagIcon,
  ClockIcon,
  HeartIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const CharityDetailsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: charities = [], isLoading } = useCharities();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const charity = charities.find(c => c._id === id);

  // Get category names from IDs
  const getNeededCategoryNames = () => {
    if (!charity?.neededCategories || !categories || categoriesLoading) {
      return [];
    }

    return charity.neededCategories
      .map(categoryId => {
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : null;
      })
      .filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ghibli-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghibli-teal mx-auto mb-4"></div>
          <p className="text-ghibli-brown text-lg">Loading charity details...</p>
        </div>
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen bg-ghibli-cream flex items-center justify-center">
        <div className="text-center">
          <BuildingOfficeIcon className="h-16 w-16 text-ghibli-brown mx-auto mb-4" />
          <p className="text-ghibli-red text-lg font-medium">Charity not found</p>
          <button
            onClick={() => navigate('/donor')}
            className="cursor-pointer mt-4 px-6 py-2 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isVerified = charity.isVerified || charity.verificationStatus === 'verified';
  const statusText = isVerified ? 'Verified' : (charity.verificationStatus || 'Pending');
  const neededCategories = getNeededCategoryNames();

  const handleDonateClick = () => {
    navigate('/donate', { state: { charityId: charity._id } });
  };

  return (
    <div className="min-h-screen bg-ghibli-cream py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/donor')}
          className="cursor-pointer flex items-center space-x-2 mb-6 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors group"
        >
          <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-ghibli border border-ghibli-brown-light overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-ghibli-blue to-ghibli-teal p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold fon-sans">{charity.charityName}</h1>
                  <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {isVerified ? <CheckCircleIcon className="h-4 w-4" /> : <ExclamationCircleIcon className="h-4 w-4" />}
                    {statusText}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <span className="bg-white bg-opacity-20 text-black px-3 py-1 rounded-full text-sm font-semibold uppercase">
                    {charity.category}
                  </span>
                  {charity.registrationNumber && (
                    <span className="text-white text-opacity-90 text-sm">
                      Registration: {charity.registrationNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2 text-white text-opacity-90">
                  <MapPinIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{charity.address}</span>
                </div>
              </div>

              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center ml-6">
                <HeartIcon className="h-10 w-10 text-black" />
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonateClick}
              className="cursor-pointer bg-white text-ghibli-teal font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <GiftIcon className="h-5 w-5" />
              Donate Now
            </button>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* About Section */}
            {charity.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-ghibli-dark-blue font-sans mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="h-6 w-6 text-ghibli-blue" />
                  Our Mission
                </h2>
                <div className="bg-ghibli-cream-lightest rounded-lg p-6 border border-ghibli-brown-light">
                  <p className="text-ghibli-brown leading-relaxed">{charity.description}</p>
                </div>
              </div>
            )}

            {/* Current Needs */}
            {neededCategories.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-ghibli-dark-blue font-sans mb-4 flex items-center gap-2">
                  <TagIcon className="h-6 w-6 text-ghibli-teal" />
                  Items We Need Most
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {neededCategories.map((categoryName, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 bg-ghibli-teal bg-opacity-10 rounded-lg border border-ghibli-teal border-opacity-20 hover:bg-opacity-15 transition-colors"
                    >
                      <div className="w-3 h-3 bg-ghibli-teal rounded-full"></div>
                      <span className="font-medium text-white">{categoryName}</span>
                    </div>
                  ))}
                </div>

                {charity.needsStatement && (
                  <div className="p-4 bg-ghibli-blue bg-opacity-10 rounded-lg border border-ghibli-blue border-opacity-20">
                    <p className="text-ghibli-dark-blue font-medium italic">"{charity.needsStatement}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Priority Items */}
            {charity.priorityItems && charity.priorityItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-ghibli-dark-blue font-sans mb-4 flex items-center gap-2">
                  <ClockIcon className="h-6 w-6 text-ghibli-red" />
                  Urgent Priority Items
                </h2>
                <div className="flex flex-wrap gap-3">
                  {charity.priorityItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-ghibli-red text-white rounded-lg text-sm font-medium shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Organization Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Charity Information */}
              <div>
                <h3 className="text-xl font-semibold text-ghibli-dark-blue font-sans mb-4 flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-ghibli-blue" />
                  Organization Information
                </h3>
                <div className="space-y-4 bg-ghibli-cream-lightest rounded-lg p-6 border border-ghibli-brown-light">
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-ghibli-brown" />
                    <div>
                      <p className="text-sm text-ghibli-brown">Email</p>
                      <p className="font-medium text-ghibli-dark-blue">{charity.email}</p>
                    </div>
                  </div>

                  {charity.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5 text-ghibli-brown" />
                      <div>
                        <p className="text-sm text-ghibli-brown">Phone</p>
                        <p className="font-medium text-ghibli-dark-blue">{charity.phoneNumber}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-ghibli-brown">Member Since</p>
                    <p className="font-medium text-ghibli-dark-blue">
                      {new Date(charity.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Person Information */}
              <div>
                <h3 className="text-xl font-semibold text-ghibli-dark-blue font-sans mb-4 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-ghibli-teal" />
                  Contact Person
                </h3>
                <div className="space-y-4 bg-ghibli-cream-lightest rounded-lg p-6 border border-ghibli-brown-light">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-ghibli-brown" />
                    <div>
                      <p className="text-sm text-ghibli-brown">Name</p>
                      <p className="font-medium text-ghibli-dark-blue">
                        {charity.contactFirstName} {charity.contactLastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-ghibli-brown" />
                    <div>
                      <p className="text-sm text-ghibli-brown">Email</p>
                      <p className="font-medium text-ghibli-dark-blue">{charity.contactEmail}</p>
                    </div>
                  </div>

                  {charity.contactPhone && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5 text-ghibli-brown" />
                      <div>
                        <p className="text-sm text-ghibli-brown">Phone</p>
                        <p className="font-medium text-ghibli-dark-blue">{charity.contactPhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-ghibli-teal to-ghibli-blue rounded-xl p-8 text-white text-center">
              <HeartIcon className="h-16 w-16 mx-auto mb-4 text-white" />
              <h3 className="text-2xl font-semibold handwritten mb-3 text-white">Ready to Make a Difference?</h3>
              <p className="text-white text-opacity-90 mb-6 max-w-2xl mx-auto">
                Your generous donation helps us continue our mission and directly impacts the lives of those we serve.
                Every contribution, no matter the size, makes a meaningful difference.
              </p>
              <button
                onClick={handleDonateClick}
                className="cursor-pointer bg-white text-ghibli-teal font-semibold px-10 py-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start Your Donation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityDetailsPage;
