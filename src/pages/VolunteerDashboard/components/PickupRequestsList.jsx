import React from 'react';
import PickupCard from '../PickupCard';

const PickupRequestsList = ({
  pickupRequests,
  selectedPickup,
  onPickupSelect,
  isAvailable
}) => {
  if (pickupRequests.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-ghibli-brown-light rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-2">No pickups available</h3>
        <p className="text-ghibli-brown text-sm">
          Try expanding your search distance or check back later for new opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-ghibli-brown-light">
      {pickupRequests.map((pickup) => (
        <PickupCard
          key={pickup.id}
          pickup={pickup}
          isSelected={selectedPickup?.id === pickup.id}
          onSelect={() => onPickupSelect(pickup)}
          disabled={!isAvailable}
        />
      ))}

      {!isAvailable && (
        <div className="p-4 bg-ghibli-brown-light bg-opacity-30 text-center">
          <p className="text-sm text-ghibli-brown">
            💡 Enable availability in the sidebar to accept pickups
          </p>
        </div>
      )}
    </div>
  );
};

export default PickupRequestsList;
