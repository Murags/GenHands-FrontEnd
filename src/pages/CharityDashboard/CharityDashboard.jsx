import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  GiftIcon,
  HeartIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const CharityDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (location.pathname === '/charity') {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const charityStats = {
    totalRequirements: 24,
    incomingDonations: 18,
    pendingDeliveries: 8,
    thankYouNotesSent: 156
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

  const StatCard = ({ title, value, subtitle, icon: Icon, bgColor, textColor }) => (
    <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ghibli-brown">{title}</p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
          <p className="text-sm text-ghibli-brown mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Requirements"
          value={charityStats.totalRequirements}
          subtitle="Items needed"
          icon={DocumentTextIcon}
          bgColor="bg-ghibli-blue"
          textColor="text-ghibli-blue"
        />
        <StatCard
          title="Incoming Donations"
          value={charityStats.incomingDonations}
          subtitle="From generous donors"
          icon={GiftIcon}
          bgColor="bg-ghibli-green"
          textColor="text-ghibli-green"
        />
        <StatCard
          title="Pending Deliveries"
          value={charityStats.pendingDeliveries}
          subtitle="Awaiting pickup"
          icon={TruckIcon}
          bgColor="bg-ghibli-yellow"
          textColor="text-ghibli-yellow"
        />
        <StatCard
          title="Thank You Notes"
          value={charityStats.thankYouNotesSent}
          subtitle="Gratitude expressed"
          icon={HeartIcon}
          bgColor="bg-ghibli-red"
          textColor="text-ghibli-red"
        />
      </div>

      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h2 className="text-xl font-semibold text-ghibli-dark-blue handwritten mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-ghibli-blue text-white p-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-3">
            <PlusIcon className="h-6 w-6" />
            <span className="font-medium">Post New Requirement</span>
          </button>
          <button className="bg-ghibli-green text-white p-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-3">
            <GiftIcon className="h-6 w-6" />
            <span className="font-medium">View Donations</span>
          </button>
          <button className="bg-ghibli-red text-white p-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-3">
            <HeartIcon className="h-6 w-6" />
            <span className="font-medium">Send Thank You</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="p-6 border-b border-ghibli-brown-light">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ghibli-dark-blue handwritten">Recent Requirements Posted</h2>
            <button className="text-ghibli-blue hover:text-ghibli-dark-blue text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-ghibli-brown-light">
          {recentRequirements.slice(0, 3).map((requirement) => {
            const urgencyInfo = getUrgencyBadge(requirement.urgency);
            const statusInfo = getStatusBadge(requirement.status);

            return (
              <div key={requirement.id} className="p-6 hover:bg-ghibli-cream-lightest transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-ghibli-dark-blue text-lg">
                        {requirement.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${urgencyInfo.color}`}>
                        {urgencyInfo.text}
                      </span>
                    </div>
                    <p className="text-sm text-ghibli-brown mb-2">
                      Items: {requirement.items.join(', ')}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-ghibli-brown">
                      <span>Target: {requirement.targetQuantity}</span>
                      <span>Received: {requirement.receivedQuantity}</span>
                      <span>Deadline: {new Date(requirement.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color} flex items-center space-x-1`}>
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

      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="p-6 border-b border-ghibli-brown-light">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ghibli-dark-blue handwritten">Recent Incoming Donations</h2>
            <button className="text-ghibli-blue hover:text-ghibli-dark-blue text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-ghibli-brown-light">
          {incomingDonations.slice(0, 3).map((donation) => {
            const statusInfo = getStatusBadge(donation.status);

            return (
              <div key={donation.id} className="p-6 hover:bg-ghibli-cream-lightest transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-ghibli-dark-blue">
                        From: {donation.donor}
                      </h3>
                      {donation.status === 'delivered' && !donation.thankYouSent && (
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
                      Items: {donation.items.join(', ')} ({donation.quantity})
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-ghibli-brown">
                      <span>Delivery: {new Date(donation.deliveryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color} flex items-center space-x-1`}>
                      <statusInfo.icon className="h-3 w-3" />
                      <span>{statusInfo.text}</span>
                    </span>
                    {donation.status === 'delivered' && !donation.thankYouSent && (
                      <button className="text-ghibli-red hover:text-ghibli-dark-blue text-xs font-medium">
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten">Charity Dashboard</h1>
            <p className="text-ghibli-brown mt-1">Post requirements, track donations, and express gratitude</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-ghibli-teal rounded-full flex items-center justify-center">
              <HeartIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-ghibli-dark-blue">Nairobi Food Bank</p>
              <p className="text-sm text-ghibli-brown">Serving the community since 2020</p>
            </div>
          </div>
        </div>
      </div>

      {renderOverview()}
    </div>
  );
};

export default CharityDashboard;
