import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharities } from '../../hooks/useCharities';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../hooks/useAuth';
import PageLayout from '../../components/layout/PageLayout';
import CharityCard from './components/PublicCharityCard';
import CharityFilters from './components/CharityFilters';
import {
  BuildingOfficeIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CharitiesPage = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [verificationFilter, setVerificationFilter] = useState('all');

  const navigate = useNavigate();
  const { data: charities = [], isLoading } = useCharities();
  const { categories = [] } = useCategories();
  const { isAuthenticated, getCurrentRole } = useAuth();

  const handleDonateClick = (charityId) => {
    if (!isAuthenticated()) {
      toast.error('Please log in to make a donation');
      navigate('/auth/signin', { state: { returnTo: `/charities/${charityId}` } });
      return;
    }

    const role = getCurrentRole();
    if (role !== 'donor') {
      toast.error('Only donors can make donations');
      return;
    }

    navigate('/donate', { state: { charityId } });
  };

  const handleCharityClick = (charityId) => {
    navigate(`/charities/${charityId}`);
  };

  // Filter charities based on search, location, categories, and verification status
  const filteredCharities = charities.filter(charity => {
    // Search filter
    const matchesSearch = !search ||
      charity.charityName?.toLowerCase().includes(search.toLowerCase()) ||
      charity.description?.toLowerCase().includes(search.toLowerCase()) ||
      charity.category?.toLowerCase().includes(search.toLowerCase());

    // Location filter
    const addressString = [
      charity.location?.address || '',
      charity.address || ''
    ].join(' ').toLowerCase();
    const matchesLocation = !location ||
      addressString.includes(location.trim().toLowerCase());

    // Category filter
    const matchesCategories = !selectedCategories.length || (() => {
      if (charity.neededCategories && charity.neededCategories.length > 0) {
        return charity.neededCategories.some(categoryId =>
          selectedCategories.includes(categoryId)
        );
      }
      if (charity.priorityItems && charity.priorityItems.length > 0) {
        return charity.priorityItems.some(priorityItem => {
          const selectedCategoryNames = selectedCategories.map(categoryId => {
            const category = categories.find(cat => cat._id === categoryId);
            return category ? category.name.toLowerCase() : '';
          }).filter(name => name);

          return selectedCategoryNames.some(categoryName =>
            priorityItem.toLowerCase().includes(categoryName) ||
            categoryName.includes(priorityItem.toLowerCase())
          );
        });
      }
      return false;
    })();

    // Verification filter
    const isVerified = charity.isVerified || charity.verificationStatus === 'verified';
    const matchesVerification = verificationFilter === 'all' ||
      (verificationFilter === 'verified' && isVerified) ||
      (verificationFilter === 'pending' && !isVerified);

    return matchesSearch && matchesLocation && matchesCategories && matchesVerification;
  });

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setSelectedCategories([]);
    setVerificationFilter('all');
  };

  const hasActiveFilters = search || location || selectedCategories.length > 0 || verificationFilter !== 'all';

  return (
    <PageLayout>
      <div className="min-h-screen bg-ghibli-cream pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-ghibli-teal rounded-full p-4 mr-4">
                <BuildingOfficeIcon className="h-12 w-12 text-white" />
              </div>
              <div className="bg-ghibli-blue rounded-full p-4 mr-4">
                <HeartIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-ghibli-dark-blue handwritten mb-4">
              Find Charities
            </h1>
            <p className="text-xl text-ghibli-brown max-w-3xl mx-auto leading-relaxed">
              Discover amazing charitable organizations making a difference in communities across Kenya.
              Find verified charities that align with your values and make meaningful contributions.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-ghibli border border-ghibli-brown-light p-6 mb-8">
            {/* Quick Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ghibli-teal" />
                <input
                  type="text"
                  placeholder="Search charities by name, description, or category..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-ghibli-brown-light bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all text-ghibli-dark-blue placeholder-ghibli-brown"
                />
              </div>

              <div className="relative flex-1">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ghibli-teal" />
                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-ghibli-brown-light bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all text-ghibli-dark-blue placeholder-ghibli-brown"
                />
              </div>
            </div>

            {/* Advanced Filters */}
            <CharityFilters
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              verificationFilter={verificationFilter}
              onVerificationFilterChange={setVerificationFilter}
              categories={categories}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-ghibli-dark-blue handwritten">
                {isLoading ? 'Loading...' : `${filteredCharities.length} Charities Found`}
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-ghibli-red hover:text-ghibli-red-dark transition-colors underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {!isLoading && charities.length > 0 && (
              <p className="text-ghibli-brown text-sm">
                Showing {filteredCharities.length} of {charities.length} total charities
              </p>
            )}
          </div>

          {/* Charities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-ghibli border border-ghibli-brown-light p-6 animate-pulse">
                  <div className="h-6 bg-ghibli-cream-lightest rounded mb-3"></div>
                  <div className="h-4 bg-ghibli-cream-lightest rounded mb-2"></div>
                  <div className="h-4 bg-ghibli-cream-lightest rounded mb-4 w-3/4"></div>
                  <div className="h-20 bg-ghibli-cream-lightest rounded mb-4"></div>
                  <div className="h-4 bg-ghibli-cream-lightest rounded mb-2"></div>
                  <div className="h-4 bg-ghibli-cream-lightest rounded w-1/2"></div>
                </div>
              ))
            ) : filteredCharities.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-12">
                  <BuildingOfficeIcon className="h-16 w-16 text-ghibli-brown-light mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-ghibli-dark-blue mb-2">No Charities Found</h3>
                  <p className="text-ghibli-brown mb-6">
                    {hasActiveFilters
                      ? 'Try adjusting your search filters to find more charities.'
                      : 'No charities are currently available.'
                    }
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredCharities.map(charity => (
                <div
                  key={charity._id}
                  className="transition-all duration-200 transform hover:-translate-y-1 hover:scale-105"
                >
                  <CharityCard
                    charity={charity}
                    onCharityClick={() => handleCharityClick(charity._id)}
                    onDonateClick={() => handleDonateClick(charity._id)}
                  />
                </div>
              ))
            )}
          </div>

          {/* Call to Action */}
          {!isLoading && filteredCharities.length > 0 && (
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-ghibli-teal to-ghibli-blue rounded-2xl p-8 text-white">
                <HeartIcon className="h-16 w-16 mx-auto mb-4 text-white" />
                <h3 className="text-3xl font-bold handwritten mb-4">Ready to Make a Difference?</h3>
                <p className="text-white text-opacity-90 mb-6 max-w-2xl mx-auto text-lg">
                  Join thousands of generous donors who are making a positive impact in communities across Kenya.
                  Every donation, no matter the size, helps create meaningful change.
                </p>
                {!isAuthenticated() && (
                  <button
                    onClick={() => navigate('/auth/select')}
                    className="bg-white text-ghibli-teal font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Join as a Donor
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CharitiesPage;
