import React from 'react';
import {
  InformationCircleIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  CubeIcon,
  CheckCircleIcon,
  TruckIcon,
  ArrowRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const PICKUP_STATUSES = {
  AVAILABLE: 'available',
  ACCEPTED: 'accepted',
  EN_ROUTE_PICKUP: 'en_route_pickup',
  ARRIVED_PICKUP: 'arrived_pickup',
  PICKED_UP: 'picked_up',
  EN_ROUTE_DELIVERY: 'en_route_delivery',
  DELIVERED: 'delivered'
};

const STATUS_CONFIG = {
  [PICKUP_STATUSES.ACCEPTED]: {
    title: 'Mission Accepted!',
    subtitle: 'Ready to start your pickup journey',
    color: 'ghibli-yellow',
    icon: CheckCircleIcon,
    nextAction: 'Start Journey to Pickup',
    nextStatus: PICKUP_STATUSES.EN_ROUTE_PICKUP
  },
  [PICKUP_STATUSES.EN_ROUTE_PICKUP]: {
    title: 'En Route to Pickup',
    subtitle: 'Traveling to collection point',
    color: 'ghibli-blue',
    icon: TruckIcon,
    nextAction: 'Arrived at Pickup Location',
    nextStatus: PICKUP_STATUSES.ARRIVED_PICKUP
  },
  [PICKUP_STATUSES.ARRIVED_PICKUP]: {
    title: 'Arrived at Pickup',
    subtitle: 'Ready to collect items',
    color: 'ghibli-teal',
    icon: MapPinIcon,
    nextAction: 'Confirm Items Collected',
    nextStatus: PICKUP_STATUSES.PICKED_UP
  },
  [PICKUP_STATUSES.PICKED_UP]: {
    title: 'Items Collected',
    subtitle: 'Ready for delivery',
    color: 'ghibli-green',
    icon: CubeIcon,
    nextAction: 'Start Delivery Journey',
    nextStatus: PICKUP_STATUSES.EN_ROUTE_DELIVERY
  },
  [PICKUP_STATUSES.EN_ROUTE_DELIVERY]: {
    title: 'En Route to Delivery',
    subtitle: 'Delivering to final destination',
    color: 'ghibli-blue',
    icon: TruckIcon,
    nextAction: 'Confirm Delivery Complete',
    nextStatus: PICKUP_STATUSES.DELIVERED
  },
  [PICKUP_STATUSES.DELIVERED]: {
    title: 'Mission Complete!',
    subtitle: 'Thank you for making a difference',
    color: 'ghibli-green',
    icon: CheckCircleIcon,
    nextAction: null,
    nextStatus: null
  }
};

const PickupFlowManager = ({
  selectedPickup,
  onUpdateStatus,
  onCancel,
  isAvailable
}) => {
  if (!selectedPickup) return null;

  const isInProgress = selectedPickup.status !== PICKUP_STATUSES.AVAILABLE &&
                      selectedPickup.status !== PICKUP_STATUSES.DELIVERED;

  const statusConfig = STATUS_CONFIG[selectedPickup.status];
  const isCompleted = selectedPickup.status === PICKUP_STATUSES.DELIVERED;

  const handleAcceptPickup = () => {
    onUpdateStatus(selectedPickup.id, PICKUP_STATUSES.ACCEPTED);
  };

  const handleNextStep = () => {
    if (statusConfig?.nextStatus) {
      onUpdateStatus(selectedPickup.id, statusConfig.nextStatus);
    }
  };

  const handleContactCall = () => {
    // In a real app, this would integrate with phone system
    window.open(`tel:${selectedPickup.phone}`);
  };

  return (
    <div className="mt-8">
      <div className={`bg-ghibli-cream rounded-xl shadow-ghibli border ${isInProgress ? 'animate-float' : ''}`}
           style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>

        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-ghibli-dark-blue handwritten flex items-center">
              <InformationCircleIcon className="h-6 w-6 mr-3 text-ghibli-green" />
              {statusConfig ? statusConfig.title : 'Pickup Details'}
            </h2>

            {/* Status Badge */}
            {statusConfig && (
              <div className={`px-4 py-2 rounded-full bg-${statusConfig.color} bg-opacity-20 border border-${statusConfig.color} border-opacity-30`}>
                <div className="flex items-center space-x-2">
                  <statusConfig.icon className={`h-5 w-5 text-${statusConfig.color}`} />
                  <span className={`text-sm font-medium text-${statusConfig.color}`}>
                    {statusConfig.subtitle}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left Column - Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-ghibli-dark-blue mb-4 handwritten">
                  {selectedPickup.charity}
                </h3>
                <div className="space-y-4">

                  {/* Address */}
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <MapPinIcon className="h-6 w-6 text-ghibli-teal mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-ghibli-dark-blue">
                        {isInProgress && selectedPickup.status === PICKUP_STATUSES.EN_ROUTE_DELIVERY ? 'Delivery Address' : 'Pickup Address'}
                      </p>
                      <p className="text-ghibli-brown">
                        {isInProgress && selectedPickup.status === PICKUP_STATUSES.EN_ROUTE_DELIVERY
                          ? selectedPickup.deliveryAddress || 'Community Center, Nairobi'
                          : selectedPickup.address}
                      </p>
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <ClockIcon className="h-6 w-6 text-ghibli-blue mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-ghibli-dark-blue">Journey Details</p>
                      <p className="text-ghibli-brown">
                        Distance: <span className="font-semibold">{selectedPickup.distance}</span> •
                        Estimated time: <span className="font-semibold">{selectedPickup.estimatedTime}</span>
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <UserIcon className="h-6 w-6 text-ghibli-green mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-ghibli-dark-blue">Contact Person</p>
                      <p className="text-ghibli-brown">{selectedPickup.contactPerson}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <p className="text-ghibli-brown text-sm">{selectedPickup.phone}</p>
                        <button
                          onClick={handleContactCall}
                          className="btn bg-ghibli-green text-white px-3 py-1 text-xs hover:bg-ghibli-dark-blue transition-colors"
                        >
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          Call
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Items & Actions */}
            <div className="space-y-6">

              {/* Items to Collect */}
              <div>
                <h4 className="text-xl font-bold text-ghibli-dark-blue mb-4 handwritten flex items-center">
                  <CubeIcon className="h-5 w-5 mr-2" />
                  Items to {selectedPickup.status === PICKUP_STATUSES.EN_ROUTE_DELIVERY ? 'Deliver' : 'Collect'}
                </h4>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-1 gap-3">
                    {selectedPickup.items.map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-ghibli-cream-lightest rounded-lg">
                        <div className="w-3 h-3 bg-ghibli-teal rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-ghibli-brown font-medium">{item}</span>
                        {selectedPickup.status === PICKUP_STATUSES.PICKED_UP && (
                          <CheckCircleIcon className="h-4 w-4 text-ghibli-green ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {selectedPickup.status === PICKUP_STATUSES.AVAILABLE && (
                  <>
                    <button
                      onClick={handleAcceptPickup}
                      className="w-full btn btn-primary text-lg py-4 flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
                      disabled={!isAvailable}
                    >
                      <CheckCircleIcon className="h-6 w-6" />
                      <span>{isAvailable ? 'Accept This Mission' : 'Set Available to Accept'}</span>
                    </button>
                    <button
                      onClick={() => onCancel(selectedPickup.id)}
                      className="w-full btn btn-secondary text-lg py-4 flex items-center justify-center space-x-2"
                    >
                      <span>View Other Options</span>
                    </button>
                  </>
                )}

                {isInProgress && statusConfig?.nextAction && (
                  <>
                    <button
                      onClick={handleNextStep}
                      className="w-full btn btn-primary text-lg py-4 flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
                    >
                      <ArrowRightIcon className="h-6 w-6" />
                      <span>{statusConfig.nextAction}</span>
                    </button>
                    <button
                      onClick={() => onCancel(selectedPickup.id)}
                      className="w-full btn btn-secondary text-lg py-4 flex items-center justify-center space-x-2"
                    >
                      <span>Cancel Mission</span>
                    </button>
                  </>
                )}

                {isCompleted && (
                  <div className="text-center p-6 bg-ghibli-green bg-opacity-10 rounded-lg border border-ghibli-green border-opacity-20">
                    <CheckCircleIcon className="h-12 w-12 text-ghibli-green mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-ghibli-green mb-2">Mission Accomplished!</h3>
                    <p className="text-ghibli-brown text-sm mb-4">
                      You've successfully completed this pickup and delivery. Thank you for making a difference!
                    </p>
                    <button
                      onClick={() => onCancel(selectedPickup.id)}
                      className="btn btn-primary"
                    >
                      Find New Mission
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupFlowManager;
