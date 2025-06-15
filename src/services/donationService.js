// Service for handling donation submissions and converting them to pickup requests

import { geocodeAddress, calculateDistance, calculateEstimatedTime, getCurrentLocation } from './geocodingService';

/**
 * Mock charity data that would come from your backend
 * Includes name, address, and pre-defined coordinates
 */
const MOCK_CHARITIES = [
  {
    id: 'charity-1',
    name: "Nairobi Food Bank",
    address: "Industrial Area, Off Nanyuki Road, Nairobi",
    coordinates: [-1.3149, 36.8433]
  },
  {
    id: 'charity-2',
    name: "Kibera Community Kitchen",
    address: "Olympic, Kibera, Nairobi",
    coordinates: [-1.3125, 36.7845]
  },
  {
    id: 'charity-3',
    name: "Mathare Children's Home",
    address: "Juja Road, Mathare, Nairobi",
    coordinates: [-1.2650, 36.8617]
  },
  {
    id: 'charity-4',
    name: "Eastlands Primary School Support",
    address: "Donholm, Nairobi",
    coordinates: [-1.2933, 36.8997]
  },
  {
    id: 'charity-5',
    name: "Mama Ngina Women's Group",
    address: "Kawangware, Nairobi",
    coordinates: [-1.2882, 36.7505]
  }
];

/**
 * Fetches the list of registered charities from the backend
 */
export const getCharities = async () => {
  try {
    // In production, this would be a real API call:
    // const response = await fetch('/api/charities');
    // if (!response.ok) throw new Error('Failed to fetch charities');
    // return await response.json();

    // Simulate API call
    console.log('Fetching list of charities...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_CHARITIES;

  } catch (error) {
    console.error('Error fetching charities:', error);
    return [];
  }
};

export const transformDonationToPickupRequest = (donationData, submissionId) => {
  // Calculate priority based on urgency level and item types
  const calculatePriority = (urgencyLevel, items, requiresRefrigeration) => {
    if (urgencyLevel === 'high' || requiresRefrigeration) return 'high';
    if (urgencyLevel === 'medium') return 'medium';
    return 'low';
  };

  // Generate items array from donation items
  const generateItemsList = (donationItems) => {
    return donationItems.map(item => {
      const baseDescription = item.description;
      const quantity = item.quantity ? ` (${item.quantity})` : '';
      const condition = item.condition !== 'good' ? ` - ${item.condition} condition` : '';
      return `${baseDescription}${quantity}${condition}`;
    });
  };

  // Determine charity/delivery destination
  const getDeliveryDestination = (preferredCharity, deliveryAddress) => {
    if (preferredCharity === 'Let donor choose') {
      return 'Donor will specify destination';
    }
    return preferredCharity || 'To be determined';
  };

  // Create pickup request object that matches volunteer dashboard format
  const pickupRequest = {
    id: submissionId,

    // Charity information (from donor's preferred destination)
    charity: donationData.preferredCharity || 'Community Donation',

    // Pickup location details
    address: donationData.pickupAddress,
    coordinates: donationData.pickupCoordinates || null, // Will be geocoded in submitDonation

    // Items to be picked up
    items: generateItemsList(donationData.donationItems),

    // Contact information
    contactPerson: donationData.donorName,
    phone: donationData.donorPhone,
    email: donationData.donorEmail,

    // Priority and urgency
    priority: calculatePriority(
      donationData.urgencyLevel,
      donationData.donationItems,
      donationData.requiresRefrigeration
    ),

    // Status (always starts as available)
    status: 'available',

    // Delivery information
    deliveryAddress: donationData.deliveryAddress,
    deliveryInstructions: donationData.deliveryInstructions,

    // Additional metadata for volunteers
    metadata: {
      // Donor information
      donorType: donationData.organizationType,
      organizationName: donationData.organizationName,

      // Pickup details
      accessNotes: donationData.accessNotes,
      totalWeight: donationData.totalWeight,
      requiresRefrigeration: donationData.requiresRefrigeration,
      fragileItems: donationData.fragileItems,

      // Scheduling preferences
      availabilityType: donationData.availabilityType,
      preferredDate: donationData.preferredDate,
      preferredTimeStart: donationData.preferredTimeStart,
      preferredTimeEnd: donationData.preferredTimeEnd,

      // Communication preferences
      contactPreference: donationData.contactPreference,
      photoConsent: donationData.photoConsent,

      // Additional notes
      additionalNotes: donationData.additionalNotes,

      // Submission timestamp
      submittedAt: new Date().toISOString(),

      // Detailed item breakdown
      itemDetails: donationData.donationItems.map(item => ({
        category: item.category,
        description: item.description,
        quantity: item.quantity,
        condition: item.condition
      }))
    }
  };

  return pickupRequest;
};

/**
 * API service functions (these would connect to your actual backend)
 */

// Submit donation and create pickup request
export const submitDonation = async (donationData) => {
  try {
    // 1. Get user location for better geocoding context
    console.log('Getting user location for context...');
    const userLocationResult = await getCurrentLocation();
    const userLocation = userLocationResult.error ? null : userLocationResult.coordinates;

    // 2. Geocode the pickup address using enhanced geocoding with location context
    console.log('Geocoding pickup address...');
    const pickupGeocode = await geocodeAddress(donationData.pickupAddress, userLocation);

    // 3. The delivery address and coordinates are pre-selected from a charity list.
    // No geocoding is needed for the delivery location.
    console.log('Using pre-selected charity for delivery location...');
    const deliveryGeocode = {
        coordinates: donationData.deliveryCoordinates,
        formattedAddress: donationData.deliveryAddress,
        shortName: donationData.preferredCharity,
        category: 'business', // Assuming charities are businesses/organizations
        confidence: 1.0, // High confidence as it's from DB
        details: {
            name: donationData.preferredCharity,
            address: donationData.deliveryAddress,
        }
    };

    // 4. Add enhanced coordinates and location data to donation data
    const enrichedDonationData = {
      ...donationData,
      pickupCoordinates: pickupGeocode.coordinates,
      deliveryCoordinates: deliveryGeocode.coordinates,
      pickupAddressFormatted: pickupGeocode.formattedAddress,
      deliveryAddressFormatted: deliveryGeocode.formattedAddress,
      pickupLocationDetails: {
        shortName: pickupGeocode.shortName,
        category: pickupGeocode.category,
        confidence: pickupGeocode.confidence,
        details: pickupGeocode.details
      },
      deliveryLocationDetails: {
        shortName: deliveryGeocode.shortName,
        category: deliveryGeocode.category,
        confidence: deliveryGeocode.confidence,
        details: deliveryGeocode.details
      }
    };

    // 5. Generate submission ID and transform to pickup request
    const submissionId = `DON-${Date.now()}`;
    const pickupRequest = transformDonationToPickupRequest(enrichedDonationData, submissionId);

    // 6. Simulate API call (replace with actual backend call)
    console.log('Submitting donation to backend...');

    // For now, we'll simulate the API call since you don't have a backend yet
    // In production, this would be a real API call:
    /*
    const response = await fetch('/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        donation: enrichedDonationData,
        pickupRequest: pickupRequest
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit donation');
    }

    const result = await response.json();
    */

    // Simulate successful submission
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    console.log('Donation submitted successfully:', {
      submissionId,
      pickupCoordinates: pickupGeocode.coordinates,
      deliveryCoordinates: deliveryGeocode.coordinates,
      pickupCategory: pickupGeocode.category,
      deliveryCategory: deliveryGeocode.category
    });

    return {
      success: true,
      submissionId: submissionId,
      pickupRequest: pickupRequest,
      message: 'Donation submitted successfully',
      geocoding: {
        pickup: pickupGeocode,
        delivery: deliveryGeocode
      }
    };

  } catch (error) {
    console.error('Error submitting donation:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit donation'
    };
  }
};

// Get pickup requests for volunteers (filtered by location, availability, etc.)
export const getPickupRequests = async (volunteerLocation, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      lat: volunteerLocation[0],
      lng: volunteerLocation[1],
      radius: filters.maxDistance || 50,
      status: 'available',
      ...filters
    });

    // In production, this would be a real API call
    const response = await fetch(`/api/pickup-requests?${queryParams}`);

    if (!response.ok) {
      throw new Error('Failed to fetch pickup requests');
    }

    const pickupRequests = await response.json();

    // Add calculated distance and estimated time for each request
    return pickupRequests.map(request => ({
      ...request,
      distance: calculateDistance(volunteerLocation[0], volunteerLocation[1], request.coordinates[0], request.coordinates[1]),
      estimatedTime: calculateEstimatedTime(
        calculateDistance(volunteerLocation[0], volunteerLocation[1], request.coordinates[0], request.coordinates[1])
      )
    }));

  } catch (error) {
    console.error('Error fetching pickup requests:', error);
    return [];
  }
};

// Update pickup request status (when volunteer accepts, completes, etc.)
export const updatePickupStatus = async (pickupId, newStatus, volunteerId) => {
  try {
    const response = await fetch(`/api/pickup-requests/${pickupId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
        volunteerId: volunteerId,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update pickup status');
    }

    return await response.json();

  } catch (error) {
    console.error('Error updating pickup status:', error);
    throw error;
  }
};

/**
 * Example API endpoint data formats for your backend implementation
 */

// POST /api/donations - Expected request body format
export const DONATION_SUBMISSION_FORMAT = {
  // Donor Information
  donorName: "string (required)",
  donorPhone: "string (required)",
  donorEmail: "string (optional)",
  organizationName: "string (optional)",
  organizationType: "enum: individual|business|organization|school|restaurant",

  // Pickup Location
  pickupAddress: "string (required)",
  pickupCoordinates: "[latitude, longitude] (geocoded automatically)",
  pickupAddressFormatted: "string (formatted by geocoding service)",
  accessNotes: "string (optional)",

  // Donation Details
  donationItems: [
    {
      category: "string (required)",
      description: "string (required)",
      quantity: "string (optional)",
      condition: "enum: excellent|good|fair"
    }
  ],
  totalWeight: "string (optional)",
  requiresRefrigeration: "boolean",
  fragileItems: "boolean",

  // Delivery Information
  deliveryAddress: "string (required, from selected charity)",
  deliveryCoordinates: "[latitude, longitude] (from selected charity)",
  deliveryAddressFormatted: "string (from selected charity)",
  preferredCharity: "string (required, name of selected charity)",
  deliveryInstructions: "string (optional)",

  // Scheduling
  availabilityType: "enum: flexible|specific|urgent",
  preferredDate: "string (ISO date, optional)",
  preferredTimeStart: "string (HH:MM, optional)",
  preferredTimeEnd: "string (HH:MM, optional)",
  urgencyLevel: "enum: low|medium|high",

  // Additional Information
  additionalNotes: "string (optional)",
  photoConsent: "boolean",
  contactPreference: "enum: phone|email|sms"
};

// GET /api/pickup-requests - Expected response format
export const PICKUP_REQUEST_FORMAT = {
  id: "string (unique identifier)",
  charity: "string (destination charity name)",
  address: "string (pickup address)",
  coordinates: "[latitude, longitude] (geocoded)",
  items: ["array of item descriptions"],
  contactPerson: "string (donor name)",
  phone: "string (donor phone)",
  email: "string (donor email, optional)",
  priority: "enum: low|medium|high",
  status: "enum: available|accepted|en_route_pickup|arrived_pickup|picked_up|en_route_delivery|delivered",
  deliveryAddress: "string",
  deliveryInstructions: "string (optional)",
  distance: "number (calculated from volunteer location in km)",
  estimatedTime: "string (calculated travel time)",
  metadata: {
    // All additional information from donation submission
    // This allows volunteers to see full context when needed
  }
};

export default {
  getCharities,
  submitDonation,
  getPickupRequests,
  updatePickupStatus,
  transformDonationToPickupRequest,
  DONATION_SUBMISSION_FORMAT,
  PICKUP_REQUEST_FORMAT
};
