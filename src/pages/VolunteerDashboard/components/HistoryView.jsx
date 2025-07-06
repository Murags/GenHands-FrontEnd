import React, { useState } from 'react';
import {
  CheckCircleIcon,
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useMyPickupHistory } from '../../../hooks/useMyPickupHistory';

const HistoryView = () => {
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const {
    pickupHistory,
    count,
    isLoading,
    isError,
    refetch,
    getDeliveredPickups,
    getCancelledPickups,
    getPickupsByDateRange,
  } = useMyPickupHistory();

  // Filter and sort history
  const getFilteredHistory = () => {
    let filtered = [...pickupHistory];

    // Status filter
    if (statusFilter === 'delivered') {
      filtered = getDeliveredPickups();
    } else if (statusFilter === 'cancelled') {
      filtered = getCancelledPickups();
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = getPickupsByDateRange(weekAgo, now);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = getPickupsByDateRange(monthAgo, now);
    } else if (dateFilter === '3months') {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filtered = getPickupsByDateRange(threeMonthsAgo, now);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortBy === 'charity') {
        return a.charity.localeCompare(b.charity);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      return 0;
    });

    return filtered;
  };

  const filteredHistory = getFilteredHistory();
  const deliveredCount = getDeliveredPickups().length;
  const cancelledCount = getCancelledPickups().length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status) => {
    return status === 'delivered' ? (
      <CheckCircleIcon className="h-5 w-5 text-ghibli-green" />
    ) : (
      <XMarkIcon className="h-5 w-5 text-ghibli-red" />
    );
  };

  const getStatusBadge = (status) => {
    return status === 'delivered' ? (
      <span className="px-2 py-1 bg-ghibli-green text-white text-xs font-medium rounded-full">
        Delivered
      </span>
    ) : (
      <span className="px-2 py-1 bg-ghibli-red text-white text-xs font-medium rounded-full">
        Cancelled
      </span>
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-ghibli-red';
      case 'medium': return 'text-ghibli-yellow';
      default: return 'text-ghibli-green';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ghibli-blue mx-auto mb-4"></div>
          <p className="text-ghibli-brown font-medium">Loading your mission history...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4">Failed to load pickup history</p>
          <button
            onClick={() => refetch()}
            className="cursor-pointer px-4 py-2 bg-ghibli-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten">Mission History</h1>
          <p className="text-ghibli-brown mt-1">
            Your completed pickup and delivery missions
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="cursor-pointer p-2 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <div className="flex items-center">
            <div className="p-3 bg-ghibli-green bg-opacity-20 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-ghibli-green" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-ghibli-brown">Successful Deliveries</p>
              <p className="text-2xl font-bold text-ghibli-dark-blue">{deliveredCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <div className="flex items-center">
            <div className="p-3 bg-ghibli-red bg-opacity-20 rounded-lg">
              <XMarkIcon className="h-6 w-6 text-ghibli-red" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-ghibli-brown">Cancelled Missions</p>
              <p className="text-2xl font-bold text-ghibli-dark-blue">{cancelledCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <div className="flex items-center">
            <div className="p-3 bg-ghibli-blue bg-opacity-20 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-ghibli-blue" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-ghibli-brown">Success Rate</p>
              <p className="text-2xl font-bold text-ghibli-dark-blue">
                {count > 0 ? Math.round((deliveredCount / count) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center space-x-4 mb-4">
          <FunnelIcon className="h-5 w-5 text-ghibli-brown" />
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Time Period</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="cursor-pointer w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            >
              <option value="date">Most Recent</option>
              <option value="charity">Charity Name</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="p-6 border-b border-ghibli-brown-light">
          <h3 className="text-xl font-semibold text-ghibli-dark-blue font-sans">
            Mission History ({filteredHistory.length})
          </h3>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-ghibli-brown-light mx-auto mb-4" />
            <p className="text-ghibli-brown">No missions found for the selected filters</p>
          </div>
        ) : (
          <div className="divide-y divide-ghibli-brown-light">
            {filteredHistory.map((pickup) => (
              <div key={pickup.id} className="p-6 hover:bg-ghibli-cream-lightest transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(pickup.status)}
                      <h4 className="font-semibold text-ghibli-dark-blue">{pickup.charity}</h4>
                      {getStatusBadge(pickup.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center text-ghibli-brown">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span className="font-medium">Pickup:</span>
                          <span className="ml-1 truncate">{pickup.pickupAddress}</span>
                        </div>
                        <div className="flex items-center text-ghibli-brown">
                          <TruckIcon className="h-4 w-4 mr-2" />
                          <span className="font-medium">Delivery:</span>
                          <span className="ml-1 truncate">{pickup.deliveryAddress}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-ghibli-brown">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          <span className="font-medium">Completed:</span>
                          <span className="ml-1">{formatDate(pickup.updatedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-ghibli-brown mr-2">Priority:</span>
                          <span className={`capitalize font-medium ${getPriorityColor(pickup.priority)}`}>
                            {pickup.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-ghibli-brown-light">
                      <div className="flex items-center text-sm text-ghibli-brown">
                        <span className="font-medium mr-2">Items:</span>
                        <span>{pickup.items.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
