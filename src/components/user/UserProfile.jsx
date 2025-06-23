import React from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const UserProfile = ({ className = '' }) => {
  const { user, loading, error, refetch } = useCurrentUser();

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghibli-teal"></div>
          <span className="ml-3 text-ghibli-brown">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6 ${className}`}>
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="h-12 w-12 text-ghibli-red mx-auto mb-4" />
          <h3 className="text-lg font-medium text-ghibli-dark-blue mb-2">Error Loading Profile</h3>
          <p className="text-ghibli-brown mb-4">{error?.message || 'Failed to load user profile'}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6 ${className}`}>
        <div className="text-center py-8">
          <UserIcon className="h-12 w-12 text-ghibli-brown mx-auto mb-4" />
          <p className="text-ghibli-brown">No user data available</p>
        </div>
      </div>
    );
  }

  const getVerificationBadge = () => {
    if (user.role !== 'volunteer' && user.role !== 'charity') return null;

    if (user.isPending) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
          <ClockIcon className="h-4 w-4" />
          <span>Pending Verification</span>
        </div>
      );
    }

    if (user.isRejected) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
          <XCircleIcon className="h-4 w-4" />
          <span>Verification Rejected</span>
        </div>
      );
    }

    if (user.verificationStatus === 'verified') {
      return (
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          <CheckBadgeIcon className="h-4 w-4" />
          <span>Verified</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-ghibli-brown-light">
        <div className="w-16 h-16 bg-ghibli-blue rounded-full flex items-center justify-center">
          {user.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-ghibli-dark-blue handwritten mb-1">
            {user.name}
          </h1>
          <p className="text-lg text-ghibli-teal font-medium mb-2">
            {user.userType}
          </p>
          <p className="text-ghibli-brown mb-2">{user.email}</p>
          {getVerificationBadge()}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-ghibli-dark-blue handwritten">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="h-5 w-5 text-ghibli-teal" />
            <div>
              <p className="text-sm text-ghibli-brown">Email</p>
              <p className="font-medium text-ghibli-dark-blue">{user.email}</p>
            </div>
          </div>

          {user.phoneNumber && (
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-5 w-5 text-ghibli-teal" />
              <div>
                <p className="text-sm text-ghibli-brown">Phone</p>
                <p className="font-medium text-ghibli-dark-blue">{user.phoneNumber}</p>
              </div>
            </div>
          )}

          {user.address && (
            <div className="flex items-center space-x-3 md:col-span-2">
              <MapPinIcon className="h-5 w-5 text-ghibli-teal" />
              <div>
                <p className="text-sm text-ghibli-brown">Address</p>
                <p className="font-medium text-ghibli-dark-blue">{user.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role-specific Information */}
      {user.role === 'charity' && (
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue handwritten">
            Charity Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.charityName && (
              <div>
                <p className="text-sm text-ghibli-brown">Charity Name</p>
                <p className="font-medium text-ghibli-dark-blue">{user.charityName}</p>
              </div>
            )}

            {user.category && (
              <div>
                <p className="text-sm text-ghibli-brown">Category</p>
                <p className="font-medium text-ghibli-dark-blue">{user.category}</p>
              </div>
            )}

            {user.registrationNumber && (
              <div>
                <p className="text-sm text-ghibli-brown">Registration Number</p>
                <p className="font-medium text-ghibli-dark-blue">{user.registrationNumber}</p>
              </div>
            )}
          </div>

          {user.description && (
            <div>
              <p className="text-sm text-ghibli-brown">Description</p>
              <p className="text-ghibli-dark-blue">{user.description}</p>
            </div>
          )}

          {user.neededCategories && user.neededCategories.length > 0 && (
            <div>
              <p className="text-sm text-ghibli-brown mb-2">Needed Categories</p>
              <div className="flex flex-wrap gap-2">
                {user.neededCategories.map(category => (
                  <span
                    key={category._id}
                    className="px-3 py-1 bg-ghibli-cream-lightest text-ghibli-dark-blue rounded-full text-sm border border-ghibli-brown-light"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.needsStatement && (
            <div>
              <p className="text-sm text-ghibli-brown">Current Needs</p>
              <p className="text-ghibli-dark-blue bg-ghibli-cream-lightest p-3 rounded-lg border border-ghibli-brown-light">
                {user.needsStatement}
              </p>
            </div>
          )}
        </div>
      )}

      {user.role === 'volunteer' && (
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue handwritten">
            Volunteer Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.transportationMode && (
              <div>
                <p className="text-sm text-ghibli-brown">Transportation</p>
                <p className="font-medium text-ghibli-dark-blue capitalize">{user.transportationMode}</p>
              </div>
            )}

            {user.availability && (
              <div>
                <p className="text-sm text-ghibli-brown">Availability</p>
                <p className="font-medium text-ghibli-dark-blue capitalize">{user.availability}</p>
              </div>
            )}

            {user.assignedTasksCount !== undefined && (
              <div>
                <p className="text-sm text-ghibli-brown">Completed Tasks</p>
                <p className="font-medium text-ghibli-dark-blue">{user.assignedTasksCount}</p>
              </div>
            )}
          </div>

          {user.skills && user.skills.length > 0 && (
            <div>
              <p className="text-sm text-ghibli-brown mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-ghibli-cream-lightest text-ghibli-dark-blue rounded-full text-sm border border-ghibli-brown-light"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Account Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ghibli-dark-blue handwritten">
          Account Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ghibli-brown">Member Since</p>
            <p className="font-medium text-ghibli-dark-blue">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-ghibli-brown">Last Updated</p>
            <p className="font-medium text-ghibli-dark-blue">
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {user.lastLogin && (
            <div>
              <p className="text-ghibli-brown">Last Login</p>
              <p className="font-medium text-ghibli-dark-blue">
                {new Date(user.lastLogin).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
