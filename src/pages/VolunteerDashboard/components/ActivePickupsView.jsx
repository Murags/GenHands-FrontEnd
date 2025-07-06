import React, { useState } from 'react';
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
  XMarkIcon
} from '@heroicons/react/24/outline';
import MapComponent from '../MapComponent';

const PICKUP_STATUSES = {
  ACCEPTED: 'accepted',
  EN_ROUTE_PICKUP: 'en_route_pickup',
  ARRIVED_PICKUP: 'arrived_pickup',
  PICKED_UP: 'picked_up',
  EN_ROUTE_DELIVERY: 'en_route_delivery',
  DELIVERED: 'delivered'
};

const ActivePickupsView = ({
  activePickups,
  onUpdateStatus,
  onCancel,
  userLocation
}) => {
  const [selectedMission, setSelectedMission] = useState(activePickups[0] || null);
  const [showRouting, setShowRouting] = useState(false);
  const [routingDestination, setRoutingDestination] = useState(null);

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
    onUpdateStatus(pickupId, newStatus);
    // Update selected mission if it's the one being updated
    if (selectedMission?.id === pickupId) {
      setSelectedMission(prev => ({ ...prev, status: newStatus }));
    }
  };

  const startNavigation = (mission) => {
    const isDeliveryPhase = [PICKUP_STATUSES.PICKED_UP, PICKUP_STATUSES.EN_ROUTE_DELIVERY].includes(mission.status);
    const destination = {
      coordinates: isDeliveryPhase ? mission.deliveryCoordinates || mission.coordinates : mission.coordinates,
      address: isDeliveryPhase ? mission.deliveryAddress : mission.address,
      name: isDeliveryPhase ? 'Delivery Location' : mission.charity,
      isDelivery: isDeliveryPhase
    };

    setRoutingDestination(destination);
    setShowRouting(true);
  };

  const closeRouting = () => {
    setShowRouting(false);
    setRoutingDestination(null);
  };

  const callContact = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  if (activePickups.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-20 h-20 bg-ghibli-teal rounded-full flex items-center justify-center mx-auto mb-6">
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
      </div>
    );
  }

  // Show routing view when navigation is active
  if (showRouting && routingDestination) {
    return (
      <div className="space-y-6">
        {/* Routing Header */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              routingDestination.isDelivery ? 'bg-ghibli-green' : 'bg-ghibli-blue'
            }`}>
              {routingDestination.isDelivery ? (
                <TruckIcon className="h-6 w-6 text-white" />
              ) : (
                <MapPinIcon className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ghibli-dark-blue font-sans">
                {routingDestination.isDelivery ? 'Delivering to' : 'Navigating to'} {routingDestination.name}
              </h1>
              <p className="text-ghibli-brown">{routingDestination.address}</p>
            </div>
          </div>
          <button
            onClick={closeRouting}
            className="cursor-pointer p-2 hover:bg-ghibli-cream rounded-lg transition-colors"
          >
            <XMarkIcon className="cursor-pointer h-6 w-6 text-ghibli-brown" />
          </button>
        </div>

        {/* Navigation Map */}
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light overflow-hidden">
          <div className="h-[600px]">
            <MapComponent
              userLocation={userLocation}
              pickupRequests={[selectedMission]}
              selectedPickup={selectedMission}
              onPickupSelect={() => {}}
              showRouting={true}
              routingDestination={routingDestination.coordinates}
              routingMode={routingDestination.isDelivery ? 'delivery' : 'pickup'}
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Contact Button */}
            <button
              onClick={() => callContact(selectedMission.phone)}
              className="cursor-pointer flex items-center justify-center space-x-2 bg-ghibli-green text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              <PhoneIcon className="cursor-pointer h-5 w-5" />
              <span>Call Contact</span>
            </button>

            {/* Status Update Button */}
            <button
              onClick={() => handleStatusUpdate(selectedMission.id, getStatusInfo(selectedMission.status).nextStatus)}
              className="cursor-pointer bg-ghibli-teal text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              {getStatusInfo(selectedMission.status).nextAction}
            </button>

            {/* Back to Mission Details */}
            <button
              onClick={closeRouting}
              className="cursor-pointer bg-ghibli-brown-light text-ghibli-brown px-4 py-3 rounded-lg font-medium hover:bg-white transition-colors"
            >
              Back to Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten">Active Missions</h1>
          <p className="text-ghibli-brown mt-1">
            Manage your ongoing pickups and deliveries
          </p>
        </div>
        <div className="bg-ghibli-teal text-white px-4 py-2 rounded-full text-sm font-medium">
          {activePickups.length} Active Mission{activePickups.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
            <div className="p-4 border-b border-ghibli-brown-light">
              <h3 className="text-lg font-semibold text-ghibli-dark-blue font-sans">Your Missions</h3>
            </div>
            <div className="divide-y divide-ghibli-brown-light">
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
                        <p className="text-sm text-ghibli-brown mt-1">{pickup.address}</p>
                        <div className="flex items-center mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="w-8 h-8 bg-ghibli-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {pickup.id}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mission Details */}
        <div className="lg:col-span-2">
          {selectedMission ? (
            <div className="space-y-6">
              {/* Mission Status Card */}
              <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-ghibli-dark-blue font-sans">
                      {selectedMission.charity}
                    </h2>
                    <button
                      onClick={() => onCancel(selectedMission.id)}
                      className="cursor-pointer px-4 py-2 bg-ghibli-red text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Cancel Mission
                    </button>
                  </div>

                  {/* Current Status */}
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

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Navigation Button */}
                    <button
                      onClick={() => startNavigation(selectedMission)}
                      className="cursor-pointer flex items-center justify-center space-x-2 bg-ghibli-blue text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      <MapIcon className="cursor-pointer h-5 w-5" />
                      <span>
                        {[PICKUP_STATUSES.PICKED_UP, PICKUP_STATUSES.EN_ROUTE_DELIVERY].includes(selectedMission.status)
                          ? 'Navigate to Delivery'
                          : 'Navigate to Pickup'
                        }
                      </span>
                    </button>

                    {/* Contact Button */}
                    <button
                      onClick={() => callContact(selectedMission.phone)}
                      className="cursor-pointer flex items-center justify-center space-x-2 bg-ghibli-green text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      <PhoneIcon className="cursor-pointer h-5 w-5" />
                      <span>Call {selectedMission.contactPerson}</span>
                    </button>
                  </div>

                  {/* Next Action */}
                  {selectedMission.status !== PICKUP_STATUSES.DELIVERED && (
                    <button
                      onClick={() => handleStatusUpdate(selectedMission.id, getStatusInfo(selectedMission.status).nextStatus)}
                      className="cursor-pointer w-full bg-ghibli-teal text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>{getStatusInfo(selectedMission.status).nextAction}</span>
                      <ArrowRightIcon className="cursor-pointer h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mission Details */}
              <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4 font-sans">Mission Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Info */}
                    <div>
                      <h4 className="font-semibold text-ghibli-dark-blue mb-3 flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-ghibli-teal" />
                        Pickup Location
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-ghibli-brown">{selectedMission.address}</p>
                        <p className="text-ghibli-brown">
                          <span className="font-medium">Contact:</span> {selectedMission.contactPerson}
                        </p>
                        <p className="text-ghibli-brown">
                          <span className="font-medium">Phone:</span> {selectedMission.phone}
                        </p>
                        <p className="text-ghibli-brown">
                          <span className="font-medium">Distance:</span> {selectedMission.distance}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                      <h4 className="font-semibold text-ghibli-dark-blue mb-3 flex items-center">
                        <TruckIcon className="h-5 w-5 mr-2 text-ghibli-blue" />
                        Delivery Location
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-ghibli-brown">{selectedMission.deliveryAddress}</p>
                        <p className="text-ghibli-brown">
                          <span className="font-medium">Items:</span> {selectedMission.items.join(', ')}
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
  );
};

export default ActivePickupsView;
