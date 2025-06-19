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
  const isSettings = routerLocation.pathname === '/donor/settings';

  // Get donor info from localStorage for profile
  const donor = JSON.parse(localStorage.getItem('donor') || '{}');

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <DonorSidebar />
      <main className="flex-1 flex flex-col p-0 md:p-8 bg-white">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100">
          <h1 className="text-3xl font-bold font-sans text-black tracking-tight mb-2 md:mb-0">
            {isMyDonations
              ? 'My Donations'
              : isProfile
              ? 'My Profile'
              : isSettings
              ? 'Settings'
              : 'Donate Now!'}
          </h1>
          {!isMyDonations && !isProfile && !isSettings && (
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
        <div className="flex-1 w-full max-w-7xl mx-auto mt-8">
          {isMyDonations ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {isLoadingDonations ? (
                <div className="col-span-full text-center text-gray-500 py-12 text-lg">Loading donations...</div>
              ) : donations.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-12 text-lg">No donations to show yet.</div>
              ) : (
                donations.map(donation => (
                  <DonationCard key={donation._id} donation={donation} />
                ))
              )}
            </div>
          ) : isProfile ? (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg cursor-pointer p-8">
              <div className="ml-40 w-14 h-14 bg-black rounded-full flex items-center justify-center mb-2 shadow-lg">
                <UserIcon className="h-7 w-7 text-white" />
              </div>
              <div className="mb-2 font-sans text-black text-center pb-8 pt-8"><span className="font-semibold font-sans text-black"></span> {donor.name}</div>
              <div className="mb-2 font-sans text-black text-center pb-8"><span className="font-semibold font-sans text-black"></span> {donor.email}</div>
            </div>
          ) : isSettings ? (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 text-center text-black font-sans text-lg">
              Edit your settings and app preferences here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {isLoading ? (
                <div className="col-span-full text-center text-gray-500 py-12 text-lg">Loading charities...</div>
              ) : filteredCharities.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-12 text-lg">No charities found.</div>
              ) : (
                filteredCharities.map(charity => (
                  <div
                    key={charity._id}
                    className="transition-transform transform hover:-translate-y-2"
                    style={{ filter: 'drop-shadow(0 4px 24px rgba(80,80,180,0.10))' }}
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
