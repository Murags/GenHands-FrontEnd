import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCharities } from '../../hooks/useCharities';
import { useDonations } from '../../hooks/useDonations';
import DonorSidebar from './components/DonorSidebar';
import CharityCard from './components/CharityCard';
import SearchAndFilterBar from './components/SearchAndFilterBar';
import DonationCard from './components/DonationCard';
import { UserIcon } from '@heroicons/react/24/outline';

const DonorDashboard = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('');
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const { data: charities = [], isLoading } = useCharities();
  const { data: donations = [], isLoading: isLoadingDonations } = useDonations();

  const filteredCharities = charities.filter(charity => {
    const matchesSearch =
      charity.charityName?.toLowerCase().includes(search.toLowerCase()) ||
      charity.description?.toLowerCase().includes(search.toLowerCase());

    const addressString = [
      charity.location?.address || '',
      charity.address || ''
    ].join(' ').toLowerCase();

    const matchesLocation = location
      ? addressString.includes(location.trim().toLowerCase())
      : true;

    const matchesPriority = priority
      ? (charity.priorityItems || []).some(item =>
          item.toLowerCase().includes(priority.toLowerCase())
        )
      : true;

    return matchesSearch && matchesLocation && matchesPriority;
  });

  // Determine which page to show
  const isMyDonations = routerLocation.pathname === '/donor/my-donations';
  const isProfile = routerLocation.pathname === '/donor/profile';

  // Get donor info from localStorage for profile
  const donor = JSON.parse(localStorage.getItem('donor') || '{}');

  return (
    <div className="flex min-h-screen bg-ghibli-cream font-sans">
      <DonorSidebar />
      <main className="flex-1 flex flex-col p-0 md:p-8 bg-ghibli-cream">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten tracking-tight mb-2 md:mb-0">
            {isMyDonations
              ? 'My Donations'
              : isProfile
              ? 'My Profile'
              : 'Donate Now!'}
          </h1>
          {!isMyDonations && !isProfile && (
            <div className="w-full md:w-auto md:flex-1 md:ml-8">
              <SearchAndFilterBar
                search={search}
                onSearchChange={setSearch}
                location={location}
                onLocationChange={setLocation}
                priority={priority}
                onPriorityChange={setPriority}
              />
            </div>
          )}
        </div>
        {/* Main content */}
        <div className="flex-1 w-full max-w-7xl mx-auto">
          {isMyDonations ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {isLoadingDonations ? (
                <div className="col-span-full text-center py-12">
                  <div className="flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghibli-teal"></div>
                  </div>
                  <p className="text-ghibli-brown text-lg">Loading donations...</p>
                </div>
              ) : donations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-8">
                    <p className="text-ghibli-brown text-lg mb-4">No donations to show yet.</p>
                    <p className="text-ghibli-brown text-sm">Start making a difference by donating to a charity!</p>
                  </div>
                </div>
              ) : (
                donations.map(donation => (
                  <DonationCard key={donation._id} donation={donation} />
                ))
              )}
            </div>
          ) : isProfile ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-ghibli-teal rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <UserIcon className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-ghibli-brown mb-1">Name</p>
                      <p className="text-xl font-semibold text-ghibli-dark-blue handwritten">{donor.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-ghibli-brown mb-1">Email</p>
                      <p className="text-lg text-ghibli-dark-blue">{donor.email || 'Not provided'}</p>
                    </div>
                    <div className="pt-4 border-t border-ghibli-brown-light">
                      <p className="text-sm text-ghibli-brown">Member since</p>
                      <p className="text-ghibli-dark-blue">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghibli-teal"></div>
                  </div>
                  <p className="text-ghibli-brown text-lg">Loading charities...</p>
                </div>
              ) : filteredCharities.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-8">
                    <p className="text-ghibli-brown text-lg mb-4">No charities found.</p>
                    <p className="text-ghibli-brown text-sm">Try adjusting your search filters.</p>
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
                      onClick={() => navigate(`/donor/charity/${charity._id}`)}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;
