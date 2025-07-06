import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import MapComponent from './MapComponent';
import { useMyPickups } from '../../hooks/useMyPickups';
import { useUpdatePickupStatus } from '../../hooks/useUpdatePickupStatus';

const PICKUP_STATUSES = {
  ACCEPTED: 'accepted',
  EN_ROUTE_PICKUP: 'en_route_pickup',
  ARRIVED_PICKUP: 'arrived_pickup',
  PICKED_UP: 'picked_up',
  EN_ROUTE_DELIVERY: 'en_route_delivery',
  DELIVERED: 'delivered'
};

const ActivePickups = () => {
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState(null);
  const [showRouting, setShowRouting] = useState(false);
  const [routingDestination, setRoutingDestination] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const {
    myPickups,
    isLoading,
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
      setUserLocation([-1.2921, 36.8219]);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const activePickups = myPickups.filter(
    (p) => p.status !== 'delivered' && p.status !== 'cancelled'
  );

  useEffect(() => {
    if (activePickups.length > 0 && !selectedMission) {
      setSelectedMission(activePickups[0]);
    }
  }, [activePickups, selectedMission]);

  const getStatusInfo = (status) => {
    const statusMap = {
      [PICKUP_STATUSES.ACCEPTED]: {
        label: 'Mission Accepted',
        color: 'bg-ghibli-blue',
        icon: CheckCircleIcon,
        nextAction: 'Start Navigation to Pickup',
        nextStatus: PICKUP_STATUSES.EN_ROUTE_PICKUP
      },
      [PICKUP_STATUSES.EN_ROUTE_PICKUP]: {
        label: 'En Route to Pickup',
        color: 'bg-ghibli-yellow',
        icon: TruckIcon,
        nextAction: 'Mark as Arrived',
        nextStatus: PICKUP_STATUSES.ARRIVED_PICKUP
      },
      [PICKUP_STATUSES.ARRIVED_PICKUP]: {
        label: 'Arrived at Pickup',
        color: 'bg-ghibli-teal',
        icon: MapPinIcon,
        nextAction: 'Confirm Items Picked Up',
        nextStatus: PICKUP_STATUSES.PICKED_UP
      },
      [PICKUP_STATUSES.PICKED_UP]: {
        label: 'Items Collected',
        color: 'bg-ghibli-green',
        icon: CheckCircleIcon,
        nextAction: 'Start Navigation to Delivery',
        nextStatus: PICKUP_STATUSES.EN_ROUTE_DELIVERY
      },
      [PICKUP_STATUSES.EN_ROUTE_DELIVERY]: {
        label: 'En Route to Delivery',
        color: 'bg-ghibli-blue',
        icon: TruckIcon,
        nextAction: 'Mark as Delivered',
        nextStatus: PICKUP_STATUSES.DELIVERED
      }
    };
    return statusMap[status] || statusMap[PICKUP_STATUSES.ACCEPTED];
  };

  const handleStatusUpdate = (pickupId, newStatus) => {
    updateStatus({ pickupId, status: newStatus }, {
      onSuccess: () => {
        refetchMyPickups();
        if (selectedMission?.id === pickupId) {
          setSelectedMission(prev => ({ ...prev, status: newStatus }));
        }
        if (newStatus === PICKUP_STATUSES.DELIVERED) {
          navigate('/volunteer');
        }
      }
    });
  };

  const startNavigation = (mission) => {
    if (showRouting) {
      setShowRouting(false);
      setRoutingDestination(null);
      return;
    }

    const isDeliveryPhase = [PICKUP_STATUSES.PICKED_UP, PICKUP_STATUSES.EN_ROUTE_DELIVERY].includes(mission.status);

    const destination = {
      coordinates: isDeliveryPhase ? mission.destinationCoordinates : mission.pickupCoordinates,
      address: isDeliveryPhase ? mission.deliveryAddress : mission.pickupAddress,
      name: isDeliveryPhase ? mission.charity : 'Pickup Location',
      isDelivery: isDeliveryPhase,
    };

    setRoutingDestination(destination);
    setShowRouting(true);
  };

  const closeRouting = () => {
    setShowRouting(false);
    setRoutingDestination(null);
  };

  const handleCancel = (pickupId) => {
    updateStatus({ pickupId, status: 'cancelled' }, {
      onSuccess: () => {
        refetchMyPickups();
        setSelectedMission(null);
        if (activePickups.length <= 1) {
          navigate('/volunteer');
        }
      }
    });
  };

  const callContact = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ghibli-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ghibli-blue mx-auto mb-4"></div>
          <p className="text-ghibli-brown font-medium">Loading your active missions...</p>
        </div>
      </div>
    );
  }

  if (activePickups.length === 0) {
    return (
      <div className="min-h-screen bg-ghibli-cream p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/volunteer')}
              className="cursor-pointer flex items-center space-x-2 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-ghibli-teal bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TruckIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-ghibli-dark-blue mb-4 handwritten">No Active Missions</h2>
            <p className="text-ghibli-brown mb-6">
              You don't have any active pickups right now. Head to the dashboard to find new opportunities!
            </p>
            <div className="bg-ghibli-cream-lightest rounded-lg p-4 border border-ghibli-brown-light">
              <p className="text-sm text-ghibli-brown">
                💡 <strong>Tip:</strong> Once you accept a pickup, you'll see detailed navigation and delivery management here.
              </p>
            </div>
            <button
              onClick={() => navigate('/volunteer')}
              className="cursor-pointer mt-6 bg-ghibli-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghibli-cream p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/volunteer')}
              className="cursor-pointer flex items-center space-x-2 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-ghibli-dark-blue font-sans">Active Missions</h1>
              <p className="text-ghibli-brown mt-1">
                Manage your ongoing pickups and deliveries
              </p>
            </div>
          </div>
          <div className="bg-ghibli-teal text-white px-4 py-2 rounded-full text-sm font-medium">
            {activePickups.length} Active Mission{activePickups.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
              <div className="p-4 border-b border-ghibli-brown-light">
                <h3 className="text-lg font-semibold text-ghibli-dark-blue font-sans">Your Missions</h3>
              </div>
              <div className="divide-y divide-ghibli-brown-light max-h-[70vh] overflow-y-auto">
                {activePickups.map((pickup) => {
                  const statusInfo = getStatusInfo(pickup.status);
                  const isSelected = selectedMission?.id === pickup.id;

                  return (
                    <div
                      key={pickup.id}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected ? 'bg-ghibli-teal bg-opacity-10 border-l-4 border-l-ghibli-teal' : 'hover:bg-ghibli-cream-lightest'
                      }`}
                      onClick={() => setSelectedMission(pickup)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-ghibli-dark-blue">{pickup.charity}</h4>
                          <p className="text-sm text-ghibli-brown mt-1">{pickup.pickupAddress}</p>
                          <div className="flex items-center mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="w-8 h-8 bg-ghibli-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                            📦
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedMission ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light overflow-hidden">
                   <div className="h-[400px]">
                      <MapComponent
                        userLocation={userLocation}
                        selectedPickup={selectedMission}
                        showRouting={showRouting}
                        routingDestination={routingDestination?.coordinates}
                        routingMode={routingDestination?.isDelivery ? 'delivery' : 'pickup'}
                      />
                   </div>
                </div>

                <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-ghibli-dark-blue font-sans">
                        {selectedMission.charity}
                      </h2>
                      <button
                        onClick={() => handleCancel(selectedMission.id)}
                        className="cursor-pointer px-4 py-2 bg-ghibli-red text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                      >
                        Cancel Mission
                      </button>
                    </div>

                    <div className="bg-ghibli-cream-lightest rounded-lg p-4 mb-6">
                      <div className="flex items-center space-x-3">
                        {React.createElement(getStatusInfo(selectedMission.status).icon, {
                          className: "h-6 w-6 text-ghibli-teal"
                        })}
                        <div>
                          <h3 className="font-semibold text-ghibli-dark-blue">
                            {getStatusInfo(selectedMission.status).label}
                          </h3>
                          <p className="text-sm text-ghibli-brown">
                            {selectedMission.status === PICKUP_STATUSES.PICKED_UP
                              ? 'Ready for delivery phase'
                              : 'Follow the steps below to continue'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={() => startNavigation(selectedMission)}
                        className="cursor-pointer flex items-center justify-center space-x-2 bg-ghibli-blue text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                      >
                        <MapIcon className="h-5 w-5" />
                        <span>
                          {showRouting
                            ? 'Close Navigation'
                            : [PICKUP_STATUSES.PICKED_UP, PICKUP_STATUSES.EN_ROUTE_DELIVERY].includes(selectedMission.status)
                              ? 'Navigate to Delivery'
                              : 'Navigate to Pickup'
                          }
                        </span>
                      </button>

                      <button
                        onClick={() => callContact(selectedMission.phone)}
                        disabled
                        className="cursor-pointer flex items-center justify-center space-x-2 bg-ghibli-green text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PhoneIcon className="h-5 w-5" />
                        <span>Call Contact</span>
                      </button>
                    </div>

                    {selectedMission.status !== PICKUP_STATUSES.DELIVERED && (
                      <button
                        onClick={() => handleStatusUpdate(selectedMission.id, getStatusInfo(selectedMission.status).nextStatus)}
                        className="cursor-pointer w-full bg-ghibli-teal text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>{getStatusInfo(selectedMission.status).nextAction}</span>
                        <ArrowRightIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4 font-sans">Mission Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-ghibli-dark-blue mb-3 flex items-center">
                          <MapPinIcon className="h-5 w-5 mr-2 text-ghibli-teal" />
                          Pickup Location
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-ghibli-brown">{selectedMission.pickupAddress}</p>
                          <p className="text-ghibli-brown">
                            <span className="font-medium">Items:</span> {selectedMission.items.join(', ')}
                          </p>
                          <p className="text-ghibli-brown">
                            <span className="font-medium">Priority:</span>
                            <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                              selectedMission.priority === 'high' ? 'bg-ghibli-red text-white' :
                              selectedMission.priority === 'medium' ? 'bg-ghibli-yellow text-white' :
                              'bg-ghibli-green text-white'
                            }`}>
                              {selectedMission.priority}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-ghibli-dark-blue mb-3 flex items-center">
                          <TruckIcon className="h-5 w-5 mr-2 text-ghibli-blue" />
                          Delivery Location
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-ghibli-brown">{selectedMission.deliveryAddress}</p>
                          <p className="text-ghibli-brown">
                            <span className="font-medium">Charity:</span> {selectedMission.charity}
                          </p>
                          <p className="text-ghibli-brown">
                            <span className="font-medium">Last Updated:</span> {new Date(selectedMission.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-8 text-center">
                <TruckIcon className="h-12 w-12 text-ghibli-brown-light mx-auto mb-4" />
                <p className="text-ghibli-brown">Select a mission from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivePickups;
