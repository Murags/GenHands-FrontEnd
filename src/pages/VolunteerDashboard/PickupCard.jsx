import React from 'react';
import { MapPinIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PickupCard = ({ pickup, isSelected, onSelect, disabled = false }) => {
  const getPriorityBadge = (priority, status) => {
    if (status === 'urgent') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-ghibli-red text-white">Urgent</span>;
    } else if (priority === 'high') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-ghibli-yellow text-ghibli-dark-blue">High</span>;
    }
    return null;
  };

  return (
    <div
      className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        isSelected
          ? 'bg-white shadow-ghibli border-l-ghibli-teal'
          : 'bg-ghibli-cream-lightest hover:bg-white border-l-transparent'
      }`}
      onClick={() => !disabled && onSelect()}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-ghibli-dark-blue truncate handwritten">
              {pickup.charity}
            </h3>
            <div className="flex items-center space-x-2">
              {pickup.status === 'urgent' && (
                <ExclamationTriangleIcon className="h-4 w-4 text-ghibli-red" />
              )}
              {getPriorityBadge(pickup.priority, pickup.status)}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-ghibli-brown mb-2">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0 text-ghibli-teal" />
            <span className="truncate font-medium">{pickup.address}</span>
          </div>

          {/* Distance & Time */}
          <div className="flex items-center text-sm text-ghibli-brown mb-2">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0 text-ghibli-blue" />
            <span className="font-medium">
              <span className="text-ghibli-dark-blue">{pickup.distance}</span> •
              <span className="text-ghibli-dark-blue ml-1">{pickup.estimatedTime}</span>
            </span>
          </div>

          {/* Items Preview */}
          <div className="text-xs text-ghibli-brown">
            <span className="font-medium">{pickup.items.length} items:</span>
            <span className="ml-1">
              {pickup.items.slice(0, 2).join(', ')}
              {pickup.items.length > 2 && (
                <span className="text-ghibli-teal font-medium"> +{pickup.items.length - 2} more</span>
              )}
            </span>
          </div>
        </div>

        {/* Action Indicator */}
        <div className="ml-3 flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all ${
            isSelected
              ? 'bg-ghibli-teal shadow-sm'
              : 'bg-ghibli-blue hover:bg-ghibli-teal'
          }`}>
            {pickup.id}
          </div>
        </div>
      </div>

      {/* Selected State Info */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-ghibli-teal border-opacity-30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ghibli-brown">
              <span className="font-medium">Contact:</span> {pickup.contactPerson}
            </span>
            <span className="text-ghibli-teal font-medium">
              📍 View Details
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupCard;
