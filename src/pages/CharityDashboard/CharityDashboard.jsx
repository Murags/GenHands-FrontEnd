import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  GiftIcon,
  HeartIcon,
  DocumentTextIcon,
  ListBulletIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useCharityNeeds } from '../../hooks/useCharityNeeds';
import { useCharityDashboardStats } from '../../hooks/useCharityDashboardStats';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const CharityDashboard = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { charityNeeds } = useCharityNeeds();
  const {
    data: statsResponse,
    isLoading: isLoadingStats,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats
  } = useCharityDashboardStats();

  const { user: currentUser, loading: userLoading } = useCurrentUser();

  const dashboardStats = statsResponse?.data || null;

  const charityStats = {
    totalRequirements: 24,
    incomingDonations: 18,
    pendingDeliveries: 8,
    thankYouNotesSent: 156,
    needsListActive: !!charityNeeds
  };

  const recentRequirements = [
    {
      id: 1,
      title: 'Winter Clothing Drive',
      items: ['Warm jackets', 'Blankets', 'Socks'],
      urgency: 'high',
      targetQuantity: '200 items',
      receivedQuantity: '45 items',
      status: 'active',
      createdAt: '2024-01-15',
      deadline: '2024-02-15'
    },
    {
      id: 2,
      title: 'Food Supplies for Families',
      items: ['Rice', 'Cooking oil', 'Canned goods'],
      urgency: 'medium',
      targetQuantity: '500 kg',
      receivedQuantity: '120 kg',
      status: 'active',
      createdAt: '2024-01-10',
      deadline: '2024-01-30'
    },
    {
      id: 3,
      title: 'School Supplies for Children',
      items: ['Notebooks', 'Pens', 'Backpacks'],
      urgency: 'low',
      targetQuantity: '100 sets',
      receivedQuantity: '100 sets',
      status: 'completed',
      createdAt: '2024-01-05',
      deadline: '2024-01-25'
    }
  ];

  const incomingDonations = [
    {
      id: 1,
      donor: 'Sarah Johnson',
      items: ['Winter jackets', 'Blankets'],
      quantity: '15 items',
      status: 'confirmed',
      deliveryDate: '2024-01-20',
      thankYouSent: false
    },
    {
      id: 2,
      donor: 'Green Valley School',
      items: ['School supplies'],
      quantity: '50 sets',
      status: 'delivered',
      deliveryDate: '2024-01-18',
      thankYouSent: true
    },
    {
      id: 3,
      donor: 'Local Restaurant',
      items: ['Food supplies'],
      quantity: '30 kg',
      status: 'pending',
      deliveryDate: '2024-01-22',
      thankYouSent: false
    }
  ];

  const getUrgencyBadge = (urgency) => {
    const urgencyMap = {
      high: { color: 'bg-ghibli-red', text: 'High Priority' },
      medium: { color: 'bg-ghibli-yellow', text: 'Medium Priority' },
      low: { color: 'bg-ghibli-green', text: 'Low Priority' }
    };
    return urgencyMap[urgency] || urgencyMap.medium;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { color: 'bg-ghibli-blue', text: 'Active', icon: ClockIcon },
      completed: { color: 'bg-ghibli-green', text: 'Completed', icon: CheckCircleIcon },
      paused: { color: 'bg-ghibli-yellow', text: 'Paused', icon: ExclamationTriangleIcon },
      confirmed: { color: 'bg-ghibli-teal', text: 'Confirmed', icon: CheckCircleIcon },
      delivered: { color: 'bg-ghibli-green', text: 'Delivered', icon: TruckIcon },
      pending: { color: 'bg-ghibli-yellow', text: 'Pending', icon: ClockIcon }
    };
    return statusMap[status] || statusMap.pending;
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, bgColor, textColor, isLoading }) => (
    <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ghibli-brown">{title}</p>
          {isLoading ? (
            <div className="flex items-center mt-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghibli-blue"></div>
            </div>
          ) : (
            <>
              <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
              <p className="text-sm text-ghibli-brown mt-1">{subtitle}</p>
            </>
          )}
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten">
              Charity Dashboard
            </h1>
            <p className="text-ghibli-brown mt-1">
              Manage your needs, track donations, and express gratitude
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => refetchStats()}
              className="cursor-pointer p-2 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors rounded-lg hover:bg-ghibli-cream-lightest"
              title="Refresh Statistics"
              disabled={isLoadingStats}
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${isLoadingStats ? "animate-spin" : ""}`}
              />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-ghibli-teal rounded-full flex items-center justify-center">
                {currentUser?.profilePictureUrl ? (
                  <img
                    src={currentUser.profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || (
                      <HeartIcon className="h-5 w-5 text-white" />
                    )}
                  </span>
                )}
              </div>
              <div>
                {userLoading ? (
                  <div className="space-y-1">
                    <div className="h-4 bg-ghibli-cream-lightest rounded animate-pulse w-32"></div>
                    <div className="h-3 bg-ghibli-cream-lightest rounded animate-pulse w-24"></div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-ghibli-dark-blue">
                      {currentUser?.charityName ||
                        currentUser?.name ||
                        "Charity Organization"}
                    </p>
                    <p className="text-sm text-ghibli-brown">
                      {currentUser?.description ||
                        currentUser?.category ||
                        "Serving the community with compassion"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Error Message */}
      {isStatsError && (
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <div className="flex items-center justify-center py-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-ghibli-red mr-3" />
            <div>
              <p className="text-ghibli-red font-medium">
                Failed to load dashboard statistics
              </p>
              <button
                onClick={() => refetchStats()}
                className="cursor-pointer text-ghibli-blue hover:text-ghibli-dark-blue text-sm font-medium mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Requirements"
          value={dashboardStats?.activeRequirements?.count ?? 0}
          subtitle={dashboardStats?.activeRequirements?.label ?? "Items needed"}
          icon={DocumentTextIcon}
          bgColor="bg-ghibli-blue"
          textColor="text-ghibli-blue"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Incoming Donations"
          value={dashboardStats?.incomingDonations?.count ?? 0}
          subtitle={
            dashboardStats?.incomingDonations?.label ?? "From generous donors"
          }
          icon={GiftIcon}
          bgColor="bg-ghibli-green"
          textColor="text-ghibli-green"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Pending Deliveries"
          value={dashboardStats?.pendingDeliveries?.count ?? 0}
          subtitle={
            dashboardStats?.pendingDeliveries?.label ?? "Awaiting pickup"
          }
          icon={TruckIcon}
          bgColor="bg-ghibli-yellow"
          textColor="text-ghibli-yellow"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Thank You Notes"
          value={dashboardStats?.thankYouNotes?.count ?? 0}
          subtitle={
            dashboardStats?.thankYouNotes?.label ?? "Gratitude expressed"
          }
          icon={HeartIcon}
          bgColor="bg-ghibli-red"
          textColor="text-ghibli-red"
          isLoading={isLoadingStats}
        />
      </div>
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h2 className="text-xl font-semibold text-ghibli-dark-blue font-sans mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/charity/requirements")}
            className={`cursor-pointer p-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-3 ${
              charityNeeds
                ? "bg-ghibli-blue text-white"
                : "bg-ghibli-green text-white"
            }`}
          >
            <ListBulletIcon className="h-6 w-6" />
            <span className="font-medium">
              {charityNeeds
                ? "Manage Requirements"
                : "Create Requirements List"}
            </span>
          </button>
          <button
            onClick={() => navigate("/charity/all-donations")}
            className="cursor-pointer bg-ghibli-brown text-white p-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-3"
          >
            <DocumentTextIcon className="h-6 w-6" />
            <span className="font-medium">All Donations</span>
          </button>
          <button
            onClick={() => navigate("/charity/donations")}
            className="cursor-pointer bg-ghibli-teal text-white p-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-3"
          >
            <GiftIcon className="h-6 w-6" />
            <span className="font-medium">Incoming Donations</span>
          </button>
          <button
            onClick={() => navigate("/charity/thank-you")}
            className="cursor-pointer bg-ghibli-red text-white p-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-3"
          >
            <HeartIcon className="h-6 w-6" />
            <span className="font-medium">Send Thank You</span>
          </button>
        </div>
      </div>
      {/* Needs List Status */}
      {charityNeeds ? (
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-ghibli-dark-blue font-sans">
              Current Requirements List
            </h2>
            <span className="px-3 py-1 bg-ghibli-green text-white rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          <div className="space-y-3">
            {charityNeeds.needsStatement && (
              <div className="p-4 bg-ghibli-cream-lightest rounded-lg">
                <p className="text-ghibli-brown">
                  {charityNeeds.needsStatement}
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {charityNeeds.neededCategories
                ?.slice(0, 5)
                .map((categoryId, index) => (
                  <span
                    key={categoryId || index}
                    className="px-3 py-1 bg-ghibli-teal text-white rounded-full text-sm font-medium"
                  >
                    Category {index + 1}
                  </span>
                ))}
              {charityNeeds.neededCategories?.length > 5 && (
                <span className="px-3 py-1 bg-ghibli-brown-light text-ghibli-brown rounded-full text-sm font-medium">
                  +{charityNeeds.neededCategories.length - 5} more
                </span>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/charity/requirements")}
                className="cursor-pointer text-ghibli-blue hover:text-ghibli-dark-blue text-sm font-medium"
              >
                Manage Requirements List →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <div className="text-center py-8">
            <ListBulletIcon className="h-16 w-16 text-ghibli-brown-light mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ghibli-dark-blue mb-2">
              No Requirements List Created Yet
            </h3>
            <p className="text-ghibli-brown mb-4">
              Create a requirements list to let donors know what your
              organization needs most.
            </p>
            <button
              onClick={() => navigate("/charity/requirements")}
              className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-ghibli-green text-white rounded-lg hover:bg-opacity-90 transition-colors mx-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Your First Requirements List</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="p-6 border-b border-ghibli-brown-light">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ghibli-dark-blue font-sans">
              Recent Requirements Posted
            </h2>
            <button
              className="cursor-pointer text-ghibli-blue hover:text-ghibli-dark-blue text-sm font-medium"
              onClick={() => navigate("/charity/requirements")}
            >
              Post Requirements
            </button>
          </div>
        </div>
        <div className="divide-y divide-ghibli-brown-light">
          {recentRequirements.slice(0, 3).map((requirement) => {
            const urgencyInfo = getUrgencyBadge(requirement.urgency);
            const statusInfo = getStatusBadge(requirement.status);

            return (
              <div
                key={requirement.id}
                className="p-6 hover:bg-ghibli-cream-lightest transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-ghibli-dark-blue text-lg">
                        {requirement.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white ${urgencyInfo.color}`}
                      >
                        {urgencyInfo.text}
                      </span>
                    </div>
                    <p className="text-sm text-ghibli-brown mb-2">
                      Items: {requirement.items.join(", ")}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-ghibli-brown">
                      <span>Target: {requirement.targetQuantity}</span>
                      <span>Received: {requirement.receivedQuantity}</span>
                      <span>
                        Deadline:{" "}
                        {new Date(requirement.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color} flex items-center space-x-1`}
                    >
                      <statusInfo.icon className="h-3 w-3" />
                      <span>{statusInfo.text}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Recent Incoming Donations */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="p-6 border-b border-ghibli-brown-light">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ghibli-dark-blue font-sans">
              Recent Incoming Donations
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/charity/thank-you")}
                className="cursor-pointer text-ghibli-red hover:text-ghibli-dark-blue text-sm font-medium"
              >
                Send Thank You Notes
              </button>
              <button
                onClick={() => navigate("/charity/donations")}
                className="cursor-pointer text-ghibli-blue hover:text-ghibli-dark-blue text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-ghibli-brown-light">
          {incomingDonations.slice(0, 3).map((donation) => {
            const statusInfo = getStatusBadge(donation.status);

            return (
              <div
                key={donation.id}
                className="p-6 hover:bg-ghibli-cream-lightest transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-ghibli-dark-blue">
                        From: {donation.donor}
                      </h3>
                      {donation.status === "delivered" &&
                        !donation.thankYouSent && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-ghibli-red text-white">
                            Thank You Pending
                          </span>
                        )}
                      {donation.thankYouSent && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-ghibli-green text-white flex items-center space-x-1">
                          <HeartIcon className="h-3 w-3" />
                          <span>Thank You Sent</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ghibli-brown mb-2">
                      Items: {donation.items.join(", ")} ({donation.quantity})
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-ghibli-brown">
                      <span>
                        Delivery:{" "}
                        {new Date(donation.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color} flex items-center space-x-1`}
                    >
                      <statusInfo.icon className="h-3 w-3" />
                      <span>{statusInfo.text}</span>
                    </span>
                    {donation.status === "delivered" &&
                      !donation.thankYouSent && (
                        <button className="cursor-pointer text-ghibli-red hover:text-ghibli-dark-blue text-xs font-medium">
                          Send Thank You
                        </button>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CharityDashboard;
