import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

const DISTANCE_OPTIONS = [
  { value: 5, label: '5 km', description: '' },
  { value: 10, label: '10 km', description: '' },
  { value: 25, label: '25 km', description: '' },
  { value: 50, label: '50 km', description: '' },
  { value: 100, label: '100 km', description: '' }
];

const DistanceSelector = ({
  selectedDistance = 25,
  onDistanceChange,
  userLocation,
  requestCount = 0,
  isLoading = false
}) => {
  const hasLocation = userLocation && userLocation.length === 2;

  if (!hasLocation) {
    return (
      <div className="bg-ghibli-yellow bg-opacity-20 border border-ghibli-yellow rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-ghibli-brown">
          <MapPinIcon className="h-5 w-5" />
          <p className="text-sm font-medium">
            Enable location services to see distance-based filtering
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPinIcon className="h-5 w-5 text-ghibli-teal" />
        <h3 className="text-sm font-medium text-ghibli-dark-blue">
          Search Radius {isLoading ? (
            <span className="inline-flex items-center gap-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-ghibli-teal"></div>
              searching...
            </span>
          ) : (
            `(${requestCount} pickups found)`
          )}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {DISTANCE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onDistanceChange(option.value)}
            className={`p-3 rounded-lg border-2 transition-all text-center ${
              selectedDistance === option.value
                ? 'border-ghibli-teal bg-ghibli-teal text-white shadow-md'
                : 'border-ghibli-brown-light bg-white text-ghibli-brown hover:border-ghibli-teal hover:bg-ghibli-teal hover:bg-opacity-10'
            }`}
          >
            <div className="font-semibold text-sm">{option.label}</div>
            <div className="text-xs opacity-75 mt-1">{option.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-2 text-xs text-ghibli-brown text-center">
        Showing pickups within {selectedDistance} km of your location
      </div>
    </div>
  );
};

export default DistanceSelector;
