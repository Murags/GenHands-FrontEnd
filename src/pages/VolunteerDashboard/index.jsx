import React, { useState, useEffect } from 'react';
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
import ActivePickupsView from './components/ActivePickupsView';
import AvailabilityView from './components/AvailabilityView';
import MapComponent from './MapComponent';

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
  const [currentView, setCurrentView] = useState('dashboard');
  const [userLocation, setUserLocation] = useState(null);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const calculateEstimatedTime = (distance) => {
    const avgSpeed = 15;
    const timeInHours = distance / avgSpeed;
    const minutes = Math.round(timeInHours * 60);

    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const baseMockPickupRequests = [
    {
      id: 1,
      charity: "Nairobi Food Bank",
      address: "Mama Ngina Street, Nairobi CBD",
      coordinates: [-1.2864, 36.8172],
      items: ["Posho", "Rice", "Cooking oil", "Sugar"],
      contactPerson: "Grace Wanjiku",
      phone: "+254 712 345 678",
      priority: "high",
      status: PICKUP_STATUSES.AVAILABLE,
      deliveryAddress: "Kibera Community Center, Nairobi"
    },
    {
      id: 2,
      charity: "Kibera Community Kitchen",
      address: "Olympic Estate, Kibera",
      coordinates: [-1.3133, 36.7892],
      items: ["Ugali flour", "Vegetables", "Beans", "Milk"],
      contactPerson: "John Otieno",
      phone: "+254 723 456 789",
      priority: "medium",
      status: PICKUP_STATUSES.AVAILABLE,
      deliveryAddress: "Mathare Youth Center, Nairobi"
    },
    {
      id: 3,
      charity: "Mathare Children's Home",
      address: "Mathare North, Nairobi",
      coordinates: [-1.2833, 36.8667],
      items: ["School supplies", "Clothes", "Blankets", "Books"],
      contactPerson: "Sister Mary Njeri",
      phone: "+254 734 567 890",
      priority: "low",
      status: PICKUP_STATUSES.AVAILABLE,
      deliveryAddress: "Eastlands Primary School, Nairobi"
    }
  ];

  const updatePickupRequestsWithDistances = (userLat, userLon) => {
    return baseMockPickupRequests.map(pickup => {
      const distance = calculateDistance(userLat, userLon, pickup.coordinates[0], pickup.coordinates[1]);
      const estimatedTime = calculateEstimatedTime(parseFloat(distance));

      return {
        ...pickup,
        distance: `${distance} km`,
        estimatedTime
      };
    }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  };

  const handleSectionChange = (section) => {
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
    setPickupRequests(prev =>
      prev.map(pickup =>
        pickup.id === pickupId
          ? { ...pickup, status: newStatus }
          : pickup
      )
    );

    if (selectedPickup?.id === pickupId) {
      setSelectedPickup(prev => ({ ...prev, status: newStatus }));
    }

    if (newStatus === PICKUP_STATUSES.DELIVERED) {
      setVolunteerStats(prev => ({
        ...prev,
        completedPickups: prev.completedPickups + 1
      }));
    }

    if (newStatus === PICKUP_STATUSES.ACCEPTED && currentView === 'dashboard') {
      setCurrentView('active');
    }
  };

  const handleCancelPickup = (pickupId) => {
    if (selectedPickup?.status !== PICKUP_STATUSES.AVAILABLE) {
      setPickupRequests(prev =>
        prev.map(pickup =>
          pickup.id === pickupId
            ? { ...pickup, status: PICKUP_STATUSES.AVAILABLE }
            : pickup
        )
      );
    }
    setSelectedPickup(null);
  };

  const handleAvailabilityToggle = () => {
    setIsAvailable(!isAvailable);
  };

  const getActivePickups = () => {
    return pickupRequests.filter(pickup =>
      pickup.status !== PICKUP_STATUSES.AVAILABLE &&
      pickup.status !== PICKUP_STATUSES.DELIVERED
    );
  };

  const getFilteredPickups = () => {
    if (!showNearbyOnly) return pickupRequests;
    return pickupRequests.filter(pickup => parseFloat(pickup.distance) <= 10);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          setUserLocation([userLat, userLon]);

          const updatedRequests = updatePickupRequestsWithDistances(userLat, userLon);
          setPickupRequests(updatedRequests);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          const defaultLat = -1.2921;
          const defaultLon = 36.8219;
          setUserLocation([defaultLat, defaultLon]);

          const updatedRequests = updatePickupRequestsWithDistances(defaultLat, defaultLon);
          setPickupRequests(updatedRequests);
          setLoading(false);
        }
      );
    } else {
      const defaultLat = -1.2921;
      const defaultLon = 36.8219;
      setUserLocation([defaultLat, defaultLon]);

      const updatedRequests = updatePickupRequestsWithDistances(defaultLat, defaultLon);
      setPickupRequests(updatedRequests);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ghibli-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ghibli-blue mx-auto mb-4"></div>
          <p className="text-ghibli-brown font-medium">Finding pickup opportunities near you...</p>
        </div>
      </div>
    );
  }

  const activePickups = getActivePickups();
  const filteredPickups = getFilteredPickups();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'active':
        return (
          <ActivePickupsView
            activePickups={activePickups}
            onUpdateStatus={handleUpdatePickupStatus}
            onCancel={handleCancelPickup}
            userLocation={userLocation}
          />
        );

      case 'availability':
        return <AvailabilityView />;

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
                  value={volunteerStats.totalRequests}
                  subtitle="Viewed & accepted"
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
                          {filteredPickups.length} available
                        </span>
                      </div>

                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={() => setShowNearbyOnly(!showNearbyOnly)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            showNearbyOnly
                              ? 'bg-ghibli-teal text-white'
                              : 'bg-ghibli-brown-light text-ghibli-brown hover:bg-white'
                          }`}
                        >
                          {showNearbyOnly ? 'Nearby Only' : 'Show All'}
                        </button>
                        <span className="text-xs text-ghibli-brown">
                          {showNearbyOnly ? 'Within 10km' : 'All distances'}
                        </span>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      <PickupRequestsList
                        pickupRequests={filteredPickups}
                        selectedPickup={selectedPickup}
                        onPickupSelect={handlePickupSelect}
                        isAvailable={isAvailable}
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
                        pickupRequests={pickupRequests}
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
        activePickups={activePickups}
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
