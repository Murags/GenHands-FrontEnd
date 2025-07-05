import React, { useState, useEffect } from 'react';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  GiftIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { useCharityDonations } from '../../../hooks/useCharityDonations';

const IncomingDonations = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "",
    urgency: "",
    donorName: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const { donations, pagination, isLoading, isError, error, refetch } =
    useCharityDonations(filters);

  // Add local state for debounced category input
  const [categoryInput, setCategoryInput] = useState(filters.category);

  // Debounce category input to update filters.category
  useEffect(() => {
    const handler = setTimeout(() => {
      handleFilterChange("category", categoryInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [categoryInput]);

  // Filter out completed and cancelled donations to show only truly "incoming" donations
  const incomingDonations = donations.filter(
    (donation) => !["cancelled", "confirmed"].includes(donation.status)
  );

  // Filter incomingDonations by category name if filter is set
  const filteredIncomingDonations = filters.category
    ? incomingDonations.filter((donation) =>
        (donation.donationItems || []).some((item) =>
          (item.category?.name || "")
            .toLowerCase()
            .includes(filters.category.toLowerCase())
        )
      )
    : incomingDonations;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      status: "",
      urgency: "",
      donorName: "",
      category: "",
      startDate: "",
      endDate: "",
    });
    setCategoryInput("");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      submitted: {
        color: "bg-ghibli-yellow",
        text: "Submitted",
        icon: ClockIcon,
      },
      assigned: {
        color: "bg-ghibli-blue",
        text: "Assigned",
        icon: CheckCircleIcon,
      },
      picked_up: {
        color: "bg-ghibli-teal",
        text: "Picked Up",
        icon: TruckIcon,
      },
      delivered: {
        color: "bg-ghibli-green",
        text: "Delivered",
        icon: CheckCircleIcon,
      },
    };
    return (
      statusMap[status] || {
        color: "bg-gray-500",
        text: status,
        icon: ClockIcon,
      }
    );
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyMap = {
      low: { color: "bg-green-100 text-green-800", text: "Low" },
      medium: { color: "bg-yellow-100 text-yellow-800", text: "Medium" },
      high: { color: "bg-red-100 text-red-800", text: "High" },
    };
    return (
      urgencyMap[urgency] || {
        color: "bg-gray-100 text-gray-800",
        text: urgency,
      }
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghibli-blue"></div>
          <span className="ml-3 text-ghibli-brown">Loading donations...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-center py-8">
          <ExclamationTriangleIcon className="h-8 w-8 text-ghibli-red mr-3" />
          <div>
            <p className="text-ghibli-red font-medium">
              Failed to load donations
            </p>
            <button
              onClick={() => refetch()}
              className="cursor-pointer text-ghibli-blue hover:text-ghibli-dark-blue text-sm font-medium mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-ghibli-dark-blue handwritten">
              Incoming Donations
            </h2>
            <p className="text-ghibli-brown mt-1">
              Track active donations from submission to delivery (excludes
              completed and cancelled)
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-ghibli-teal text-white"
                  : "border border-ghibli-brown-light text-ghibli-brown hover:bg-ghibli-cream-lightest"
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 p-4 bg-ghibli-cream-lightest rounded-lg border border-ghibli-brown-light">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="assigned">Assigned</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Urgency Filter */}
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">
                  Urgency
                </label>
                <select
                  value={filters.urgency}
                  onChange={(e) =>
                    handleFilterChange("urgency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                >
                  <option value="">All Urgencies</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Donor Name Search */}
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">
                  Donor Name
                </label>
                <input
                  type="text"
                  value={filters.donorName}
                  onChange={(e) =>
                    handleFilterChange("donorName", e.target.value)
                  }
                  placeholder="Search by donor name..."
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value)}
                  placeholder="Filter by category..."
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                />
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="cursor-pointer w-full px-4 py-2 text-ghibli-brown border border-ghibli-brown-light rounded-lg hover:bg-ghibli-cream-lightest transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Donations List */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="p-6 border-b border-ghibli-brown-light">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-ghibli-dark-blue">
              Incoming Donations ({filteredIncomingDonations.length})
            </h3>
            <span className="text-sm text-ghibli-brown">
              Showing {filteredIncomingDonations.length} active donations
            </span>
          </div>
        </div>

        {filteredIncomingDonations.length === 0 ? (
          <div className="text-center py-12">
            <GiftIcon className="h-16 w-16 text-ghibli-brown-light mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ghibli-dark-blue mb-2">
              No Active Donations
            </h3>
            <p className="text-ghibli-brown">
              {Object.values(filters).some((f) => f && f !== 1 && f !== 10)
                ? "Try adjusting your filters to see more results."
                : "No donations are currently in progress. Check back later for new submissions!"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-ghibli-brown-light">
            {filteredIncomingDonations.map((donation) => {
              const statusInfo = getStatusBadge(donation.status);
              const urgencyInfo = getUrgencyBadge(donation.urgencyLevel);

              return (
                <div
                  key={donation._id}
                  className="p-6 hover:bg-ghibli-cream-lightest transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Donor Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-ghibli-teal rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-ghibli-dark-blue">
                            {donation.donorName ||
                              donation.donorId?.name ||
                              "Anonymous Donor"}
                          </h4>
                          {donation.donorId?.email && (
                            <p className="text-sm text-ghibli-brown">
                              {donation.donorId.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Donation Items */}
                      <div className="mb-3">
                        <h5 className="font-medium text-ghibli-dark-blue mb-2">
                          Donation Items:
                        </h5>
                        <div className="space-y-2">
                          {donation.donationItems?.map((item, index) => (
                            <div
                              key={item._id || index}
                              className="flex items-center space-x-3 text-sm"
                            >
                              <span className="px-2 py-1 bg-ghibli-blue bg-opacity-10 text-ghibli-blue rounded-full text-xs font-medium">
                                {item.category?.name || "Uncategorized"}
                              </span>
                              <span className="text-ghibli-brown">
                                {item.description} - {item.quantity} (
                                {item.condition})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center space-x-2 text-sm text-ghibli-brown">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          Submitted on {formatDate(donation.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Status and Urgency Badges */}
                    <div className="ml-6 flex flex-col items-end space-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color} flex items-center space-x-1`}
                      >
                        <statusInfo.icon className="h-3 w-3" />
                        <span>{statusInfo.text}</span>
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyInfo.color}`}
                      >
                        {urgencyInfo.text} Urgency
                      </span>

                      {donation.status === "delivered" && (
                        <div className="bg-ghibli-red bg-opacity-10 text-ghibli-red text-sm font-medium rounded-3xl flex items-center space-x-2">
                          <HeartIcon className="ml-3 h-4 w-4 text-white" />
                          <span className="px-3 py-1 rounded-full text-white text-xs font-medium">Thank You Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingDonations;
