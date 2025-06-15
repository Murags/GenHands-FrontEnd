import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';
import PickupRequestsList from './components/PickupRequestsList';
import PickupFlowManager from './components/PickupFlowManager';
import AvailabilityView from './components/AvailabilityView';
import MapComponent from './MapComponent';
import { usePickupRequests } from '../../hooks/usePickupRequests';
import { useUpdatePickupStatus } from '../../hooks/useUpdatePickupStatus';
import { useMyPickups } from '../../hooks/useMyPickups';

const PICKUP_STATUSES = {
  AVAILABLE: 'available',
  ACCEPTED: 'accepted',
  EN_ROUTE_PICKUP: 'en_route_pickup',
  ARRIVED_PICKUP: 'arrived_pickup',
  PICKED_UP: 'picked_up',
  EN_ROUTE_DELIVERY: 'en_route_delivery',
  DELIVERED: 'delivered'
};

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "New pickup request nearby", time: "10 min ago" },
    { id: 2, message: "Pickup completed successfully", time: "2 hours ago" },
    { id: 3, message: "Rating updated: 4.8 stars", time: "1 day ago" }
  ]);
  const [volunteerStats, setVolunteerStats] = useState({
    completedPickups: 5,
    totalRequests: 12,
    rating: 4.8
  });

  const {
    requests: pickupRequests,
    isLoading: isLoadingAvailable,
    refetch: refetchAvailable,
  } = usePickupRequests({ status: 'available' });

  const {
    myPickups,
    isLoading: isLoadingMyPickups,
    refetch: refetchMyPickups,
  } = useMyPickups();

  const { mutate: updateStatus } = useUpdatePickupStatus();

  useEffect(() => {
    let watchId;

    const success = (position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    };

    const error = (err) => {
      console.error(`ERROR(${err.code}): ${err.message}`);
      setUserLocation([-1.2921, 36.8219]);
    };

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation([-1.2921, 36.8219]); // Fallback
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);


  const handleSectionChange = (section) => {
    if (section === 'active') {
      navigate('/volunteer/active-pickups');
      return;
    }

    setCurrentView(section);
    if (section !== 'dashboard') {
      setSelectedPickup(null);
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handlePickupSelect = (pickup) => {
    setSelectedPickup(pickup);
  };

  const handleUpdatePickupStatus = (pickupId, newStatus) => {
    updateStatus({ pickupId, status: newStatus }, {
      onSuccess: () => {
        refetchAvailable(); // Refetch the list of available requests
        refetchMyPickups(); // Refetch the list of my pickups

        if (selectedPickup?.id === pickupId) {
          setSelectedPickup(prev => ({ ...prev, status: newStatus }));
        }
        if (newStatus === PICKUP_STATUSES.DELIVERED) {
          setVolunteerStats(prev => ({
            ...prev,
            completedPickups: prev.completedPickups + 1
          }));
        }
        if (newStatus === PICKUP_STATUSES.ACCEPTED) {
          navigate('/volunteer/active-pickups');
        }
      }
    });
  };

  const handleCancelPickup = (pickupId) => {
    updateStatus({ pickupId, status: 'cancelled' }, { // Use 'cancelled' as per new docs
      onSuccess: () => {
        refetchAvailable();
        refetchMyPickups();
        setSelectedPickup(null);
      }
    });
  };

  const handleAvailabilityToggle = () => {
    setIsAvailable(!isAvailable);
  };

  const activePickups = myPickups.filter(
    (p) => p.status !== 'delivered' && p.status !== 'cancelled'
  );

  const isLoading = isLoadingAvailable || isLoadingMyPickups;

  if (isLoading && !userLocation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ghibli-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ghibli-blue mx-auto mb-4"></div>
          <p className="text-ghibli-brown font-medium">Finding pickup opportunities near you...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'availability':
        return <AvailabilityView isAvailable={isAvailable} onToggle={handleAvailabilityToggle} />;

      case 'history':
        return (
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten mb-4">Mission History</h1>
            <p className="text-ghibli-brown">View your completed pickups and delivery history.</p>
          </div>
        );

      case 'notifications':
        return (
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten mb-4">Notifications</h1>
            <p className="text-ghibli-brown">Manage your notification preferences.</p>
          </div>
        );

      case 'settings':
        return (
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten mb-4">Settings</h1>
            <p className="text-ghibli-brown">Configure your account and app preferences.</p>
          </div>
        );

    default:
        return (
          <>
            <div className="bg-ghibli-cream shadow-sm border-b p-6" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-ghibli-dark-blue text-shadow handwritten">
                    Pickup Dashboard
                  </h1>
                  <p className="mt-1 text-ghibli-brown">
                    {isAvailable ? (
                      <> You're available for pickups! Ready to make a difference?</>
                    ) : (
                      <>😴 You're currently unavailable. Toggle availability in the sidebar to receive requests.</>
                    )}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isAvailable
                    ? 'bg-ghibli-green text-white'
                    : 'bg-ghibli-brown-light text-ghibli-brown'
                }`}>
                  {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Completed Pickups"
                  value={volunteerStats.completedPickups}
                  subtitle="Successful missions"
                  icon={CheckCircleIcon}
                  bgColor="bg-ghibli-green"
                  textColor="text-ghibli-green"
                />
                <StatsCard
                  title="Total Requests"
                  value={pickupRequests.length}
                  subtitle="Available now"
                  icon={EyeIcon}
                  bgColor="bg-ghibli-blue"
                  textColor="text-ghibli-blue"
                />
                <StatsCard
                  title="Volunteer Rating"
                  value={`${volunteerStats.rating}⭐`}
                  subtitle="Community feedback"
                  icon={MapPinIcon}
                  bgColor="bg-ghibli-yellow"
                  textColor="text-ghibli-yellow"
                />
                <StatsCard
                  title="Active Missions"
                  value={activePickups.length}
                  subtitle="In progress"
                  icon={TruckIcon}
                  bgColor="bg-ghibli-red"
                  textColor="text-ghibli-red"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-ghibli-cream rounded-xl shadow-ghibli border" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
                    <div className="p-4 border-b" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-ghibli-dark-blue handwritten">
                          Available Pickups
                        </h2>
                        <span className="text-sm text-ghibli-brown">
                          {pickupRequests.length} available
                        </span>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      <PickupRequestsList
                        pickupRequests={pickupRequests}
                        selectedPickup={selectedPickup}
                        onPickupSelect={handlePickupSelect}
                        isAvailable={isAvailable}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-ghibli-cream rounded-xl shadow-ghibli border" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
                    <div className="p-6 border-b" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
                      <h2 className="text-2xl font-semibold text-ghibli-dark-blue handwritten flex items-center">
                        <MapPinIcon className="h-6 w-6 mr-3 text-ghibli-blue" />
                        Pickup Locations Map
                      </h2>
                      <p className="text-ghibli-brown mt-2">Interactive map showing all available pickups</p>
                    </div>
                    <div className="h-96 lg:h-[600px] rounded-b-xl overflow-hidden">
                      <MapComponent
                        userLocation={userLocation}
                        pickups={pickupRequests}
                        selectedPickup={selectedPickup}
                        onPickupSelect={handlePickupSelect}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <PickupFlowManager
                selectedPickup={selectedPickup}
                onUpdateStatus={handleUpdatePickupStatus}
                onCancel={handleCancelPickup}
                isAvailable={isAvailable}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-ghibli-cream)' }}>
      <Sidebar
        volunteerStats={volunteerStats}
        isAvailable={isAvailable}
        onAvailabilityToggle={handleAvailabilityToggle}
        notifications={notifications}
        activePickupsCount={activePickups.length}
        onSectionChange={handleSectionChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      <div className={`flex-1 overflow-auto transition-all duration-300 p-4 ${
        isSidebarCollapsed ? 'ml-20' : 'ml-80'
      }`}>
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
