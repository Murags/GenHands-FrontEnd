import React, { useState, useEffect } from 'react';
import {
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  GiftIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useCharityDonations } from '../../../hooks/useCharityDonations';

const AllDonations = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 15,
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

  // Filter donations by category name if a filter is set
  const filteredDonations = filters.category
    ? donations.filter((donation) =>
        (donation.donationItems || []).some((item) =>
          (item.category?.name || "")
            .toLowerCase()
            .includes(filters.category.toLowerCase())
        )
      )
    : donations;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 15,
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
      confirmed: {
        color: "bg-gradient-to-r from-ghibli-blue to-ghibli-teal",
        text: "Confirmed ✓",
        icon: CheckCircleIcon,
      },
      cancelled: {
        color: "bg-ghibli-red",
        text: "Cancelled",
        icon: ExclamationTriangleIcon,
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

  const [categoryInput, setCategoryInput] = useState(filters.category);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
    const handler = setTimeout(() => {
      handleFilterChange("category", categoryInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [categoryInput]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghibli-blue"></div>
          <span className="ml-3 text-ghibli-brown">
            Loading all donations...
          </span>
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
              All Donations
            </h2>
            <p className="text-ghibli-brown mt-1">
              Complete overview of all donations from submission to completion
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => refetch()}
              className="cursor-pointer p-2 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors rounded-lg hover:bg-ghibli-cream-lightest"
              title="Refresh"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
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
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
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
            <h3 className="text-lg font-semibold text-ghibli-dark-blue">
              All Donations ({pagination.total})
            </h3>
            <span className="text-sm text-ghibli-brown">
              Showing {pagination.count} of {pagination.total} donations
            </span>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-12">
            <GiftIcon className="h-16 w-16 text-ghibli-brown-light mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ghibli-dark-blue mb-2">
              No Donations Found
            </h3>
            <p className="text-ghibli-brown">
              {Object.values(filters).some((f) => f && f !== 1 && f !== 15)
                ? "Try adjusting your filters to see more results."
                : "No donations have been received yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-ghibli-brown-light">
            {filteredDonations.map((donation) => {
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

                      {/* Dates */}
                      <div className="flex items-center space-x-6 text-sm text-ghibli-brown">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            Submitted: {formatDate(donation.createdAt)}
                          </span>
                        </div>
                        {donation.updatedAt !== donation.createdAt && (
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-4 w-4 text-ghibli-green" />
                            <span>
                              Updated: {formatDate(donation.updatedAt)}
                            </span>
                          </div>
                        )}
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

                      {/* Special indicators */}
                      {donation.status === "delivered" && (
                        <div className="mt-2 px-3 py-1 bg-ghibli-red bg-opacity-10 text-ghibli-red text-xs font-medium rounded-full flex items-center space-x-1">
                          <HeartIcon className="h-3 w-3 text-white" />
                          <span className="text-white">Thank You Pending</span>
                        </div>
                      )}

                      {donation.status === "confirmed" && (
                        <div className="mt-2 px-3 py-1 bg-ghibli-green bg-opacity-10 text-ghibli-green text-xs font-medium rounded-full flex items-center space-x-1">
                          <HeartIcon className="h-3 w-3 text-white" />
                          <span className="text-white">Thank You Sent</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-6 border-t border-ghibli-brown-light">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ghibli-brown">
                Page {pagination.currentPage} of {pagination.pages}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="cursor-pointer flex items-center space-x-1 px-3 py-2 text-ghibli-brown border border-ghibli-brown-light rounded-lg hover:bg-ghibli-cream-lightest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.pages}
                  className="cursor-pointer flex items-center space-x-1 px-3 py-2 text-ghibli-brown border border-ghibli-brown-light rounded-lg hover:bg-ghibli-cream-lightest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDonations;
