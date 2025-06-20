import React from 'react';

const DonationCard = ({ donation }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-112 justify-between border border-gray-100 cursor-pointer hover:shadow-2xl transition group border border-gray-100">
    <div>
      {/* Organization Name and Type */}
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-bold text-black font-sans">
          {donation.organizationName || 'Charity'}
        </h2>
        {donation.organizationType && (
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded uppercase">
            {donation.organizationType}
          </span>
        )}
      </div>

      {/* Donated On */}
      <div className="text-xs text-gray-500 mb-3">
        <span className="font-semibold">Donated on:</span> {new Date(donation.createdAt).toLocaleDateString()}
      </div>

      {/* Items */}
      <div className="mb-3">
        <span className="font-semibold text-sm text-black">Items:</span>
        <ul className="list-disc ml-5 text-sm text-black">
          {donation.donationItems?.map((item, idx) => (
            <li key={idx}>
              {item.quantity} x {item.category}
              {item.description && ` - ${item.description}`}
              {item.condition && (
                <span className="ml-2 text-xs text-gray-400">({item.condition})</span>
              )}
            </li>
          ))}
        </ul>
        <hr className="my-3 border-gray-200" />
      </div>

      {/* Pickup Address */}
      <div className="text-xs text-gray-600 mb-2">
        <span className="font-semibold">Pickup Address:</span> {donation.pickupAddress}
        <hr className="my-3 border-gray-200" />
      </div>

      {/* Access Notes */}
      {donation.accessNotes && (
        <div className="text-xs text-gray-600 mb-2">
          <span className="font-semibold">Access Notes:</span> {donation.accessNotes}
          <hr className="my-3 border-gray-200" />
        </div>
      )}

      {/* Delivery Instructions */}
      {donation.deliveryInstructions && (
        <div className="text-xs text-gray-600 mb-2">
          <span className="font-semibold">Delivery Instructions:</span> {donation.deliveryInstructions}
          <hr className="my-3 border-gray-200" />
        </div>
      )}

      {/* Additional Notes */}
      {donation.additionalNotes && (
        <div className="text-xs text-gray-600 mb-3">
          <span className="font-semibold">Additional Notes:</span> {donation.additionalNotes}
          <hr className="my-3 border-gray-200" />
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {donation.requiresRefrigeration && (
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Refrigeration</span>
        )}
        {donation.fragileItems && (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">Fragile</span>
        )}
        {donation.urgencyLevel && (
          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs capitalize">{donation.urgencyLevel} urgency</span>
        )}
      </div>
    </div>

    {/* Status and Weight */}
    <div className="flex items-center justify-between mt-2">
      <span className={`text-xs font-semibold px-2 py-1 rounded-full 
        ${(() => {
          const status = (donation.status || '').toLowerCase().trim();
          if (status === 'delivered') return 'bg-green-100 text-green-700';
          if (status === 'assigned') return 'bg-yellow-100 text-yellow-700';
          if (status === 'submitted') return 'bg-blue-100 text-blue-700';
          if (status === 'cancelled' || status === 'canceled') return 'bg-red-100 text-red-700';
          return 'bg-gray-100 text-gray-700';
        })()}
      `}>
        {donation.status || 'Pending'}
      </span>
      {donation.totalWeight && (
        <span className="text-xs text-gray-500">{donation.totalWeight} kg</span>
      )}
    </div>
  </div>
);

export default DonationCard;
