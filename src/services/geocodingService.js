let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests


const nominatimFetch = async (url, options = {}) => {
  // Implement rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();

  // Enhanced headers to prevent 403 errors
  const defaultHeaders = {
    'User-Agent': 'GenHands-Charity-App/1.0 (https://genhands.org; contact@genhands.org)',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': window.location.origin,
    'Cache-Control': 'no-cache'
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 403) {
      console.warn('Nominatim API returned 403, trying fallback approach...');
      // Wait a bit longer and retry once
      await new Promise(resolve => setTimeout(resolve, 2000));
      const retryResponse = await fetch(url, fetchOptions);

      if (!retryResponse.ok) {
        throw new Error(`Nominatim API error: ${retryResponse.status} ${retryResponse.statusText}`);
      }

      return retryResponse;
    }

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Nominatim fetch error:', error);
    throw error;
  }
};

/**
 * Enhanced address search with location categories and better results
 */
export const searchLocations = async (query, options = {}) => {
  try {
    if (query.length < 2) return [];

    const {
      limit = 8,
      countryCode = 'ke',
      userLocation = null,
      includeCategories = true,
      searchRadius = 50 // km
    } = options;

    // Clean and format the query
    const cleanQuery = query.trim().replace(/\s+/g, ' ');

    // Build search parameters - simplified to avoid 403 errors
    const params = new URLSearchParams({
      format: 'json',
      q: cleanQuery,
      limit: Math.min(limit, 10).toString(), // Limit to max 10 to reduce load
      countrycodes: countryCode,
      addressdetails: '1',
      dedupe: '1'
    });

    // Only add viewbox if user location is available and not too restrictive
    if (userLocation && userLocation.length === 2 && searchRadius <= 25) {
      try {
        const viewbox = getViewBox(userLocation, searchRadius);
        params.append('viewbox', viewbox);
        // Don't use bounded=1 as it can be too restrictive
      } catch (error) {
        console.warn('Error creating viewbox, proceeding without location bias:', error);
      }
    }

    const url = `https://nominatim.openstreetmap.org/search?${params}`;
    console.log('Searching:', url);

    const response = await nominatimFetch(url);
    const data = await response.json();

    // Process and categorize results
    const processedResults = data.map(item => {
      const category = categorizeLocation(item);
      const distance = userLocation ?
        calculateDistance(userLocation[0], userLocation[1], parseFloat(item.lat), parseFloat(item.lon)) : null;

      return {
        id: item.place_id,
        address: item.display_name,
        shortName: getShortName(item),
        coordinates: [parseFloat(item.lat), parseFloat(item.lon)],
        category: category,
        type: item.type,
        importance: parseFloat(item.importance || 0),
        distance: distance,
        details: {
          house_number: item.address?.house_number,
          road: item.address?.road,
          neighbourhood: item.address?.neighbourhood,
          suburb: item.address?.suburb,
          city: item.address?.city || item.address?.town,
          county: item.address?.county,
          postcode: item.address?.postcode,
          amenity: item.address?.amenity,
          shop: item.address?.shop,
          office: item.address?.office
        },
        icon: getCategoryIcon(category),
        boundingBox: item.boundingbox ? {
          north: parseFloat(item.boundingbox[1]),
          south: parseFloat(item.boundingbox[0]),
          east: parseFloat(item.boundingbox[3]),
          west: parseFloat(item.boundingbox[2])
        } : null
      };
    });

    // Sort results by relevance (importance, distance, category)
    return processedResults.sort((a, b) => {
      // Prioritize exact matches and important places
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }

      // Then by distance if available
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }

      // Finally by category priority
      const categoryPriority = {
        'business': 5,
        'landmark': 4,
        'address': 3,
        'area': 2,
        'other': 1
      };

      return (categoryPriority[b.category] || 0) - (categoryPriority[a.category] || 0);
    });

  } catch (error) {
    console.error('Location search error:', error);

    // Return fallback results for common Kenyan locations if search fails
    if (query.toLowerCase().includes('westla') || query.toLowerCase().includes('westlands')) {
      return [{
        id: 'fallback-westlands',
        address: 'Westlands, Nairobi, Kenya',
        shortName: 'Westlands',
        coordinates: [-1.2676, 36.8108],
        category: 'area',
        type: 'suburb',
        importance: 0.8,
        distance: null,
        details: {
          suburb: 'Westlands',
          city: 'Nairobi',
          county: 'Nairobi'
        },
        icon: '📍'
      }];
    }

    return [];
  }
};

/**
 * Search for specific types of places (like "restaurants near me")
 */
export const searchPlacesByCategory = async (category, userLocation, radius = 10) => {
  try {
    if (!userLocation || userLocation.length !== 2) {
      throw new Error('User location required for category search');
    }

    const categoryQueries = {
      'restaurants': 'restaurant',
      'hospitals': 'hospital',
      'schools': 'school',
      'banks': 'bank',
      'pharmacies': 'pharmacy',
      'supermarkets': 'supermarket',
      'gas_stations': 'fuel',
      'hotels': 'hotel',
      'churches': 'place_of_worship',
      'government': 'government'
    };

    const query = categoryQueries[category] || category;

    const params = new URLSearchParams({
      format: 'json',
      q: query,
      limit: '15',
      countrycodes: 'ke',
      addressdetails: '1'
    });

    // Add location bias for category search
    if (radius <= 20) {
      try {
        params.append('viewbox', getViewBox(userLocation, radius));
      } catch (error) {
        console.warn('Error creating viewbox for category search:', error);
      }
    }

    const url = `https://nominatim.openstreetmap.org/search?${params}`;
    const response = await nominatimFetch(url);
    const data = await response.json();

    return data.map(item => ({
      id: item.place_id,
      name: item.display_name.split(',')[0],
      address: item.display_name,
      coordinates: [parseFloat(item.lat), parseFloat(item.lon)],
      distance: calculateDistance(userLocation[0], userLocation[1], parseFloat(item.lat), parseFloat(item.lon)),
      category: categorizeLocation(item),
      type: item.type
    })).sort((a, b) => a.distance - b.distance);

  } catch (error) {
    console.error('Category search error:', error);
    return [];
  }
};

/**
 * Get detailed information about a specific place
 */
export const getPlaceDetails = async (placeId) => {
  try {
    const url = `https://nominatim.openstreetmap.org/details?place_id=${placeId}&format=json&addressdetails=1`;
    const response = await nominatimFetch(url);
    const data = await response.json();

    return {
      id: data.place_id,
      name: data.localname || data.names?.name,
      address: data.addresstags,
      coordinates: [parseFloat(data.centroid.coordinates[1]), parseFloat(data.centroid.coordinates[0])],
      category: data.category,
      type: data.type,
      importance: parseFloat(data.importance || 0),
      extratags: data.extratags || {},
      hierarchy: data.hierarchy || {}
    };

  } catch (error) {
    console.error('Place details error:', error);
    return null;
  }
};

/**
 * Categorize location based on OSM data
 */
const categorizeLocation = (item) => {
  const type = item.type?.toLowerCase();
  const category = item.category?.toLowerCase();
  const amenity = item.address?.amenity?.toLowerCase();
  const shop = item.address?.shop?.toLowerCase();

  // Business/Commercial
  if (amenity || shop ||
      ['shop', 'amenity', 'office', 'commercial'].includes(category) ||
      ['restaurant', 'cafe', 'bank', 'hospital', 'school', 'hotel', 'pharmacy'].includes(type)) {
    return 'business';
  }

  // Landmarks/Important places
  if (['tourism', 'historic', 'leisure'].includes(category) ||
      ['monument', 'museum', 'park', 'stadium'].includes(type)) {
    return 'landmark';
  }

  // Specific addresses
  if (item.address?.house_number || type === 'house') {
    return 'address';
  }

  // Areas/Neighborhoods
  if (['boundary', 'place'].includes(category) ||
      ['suburb', 'neighbourhood', 'city', 'town', 'village'].includes(type)) {
    return 'area';
  }

  return 'other';
};

/**
 * Get appropriate icon for category
 */
const getCategoryIcon = (category) => {
  const icons = {
    'business': '🏢',
    'landmark': '🏛️',
    'address': '🏠',
    'area': '📍',
    'other': '📌'
  };

  return icons[category] || '📌';
};

/**
 * Get short, readable name for a location
 */
const getShortName = (item) => {
  // Try to get the most relevant name
  if (item.namedetails?.name) {
    return item.namedetails.name;
  }

  // Extract first part of display name
  const parts = item.display_name.split(',');
  return parts[0].trim();
};

/**
 * Create viewbox for location-biased search with error handling
 */
const getViewBox = (center, radiusKm) => {
  try {
    const [lat, lon] = center;

    // Validate coordinates
    if (typeof lat !== 'number' || typeof lon !== 'number' ||
        lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new Error('Invalid coordinates for viewbox');
    }

    // Rough conversion: 1 degree ≈ 111 km
    const latDelta = radiusKm / 111;
    const lonDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

    const west = lon - lonDelta;
    const east = lon + lonDelta;
    const south = lat - latDelta;
    const north = lat + latDelta;

    // Ensure bounds are reasonable
    const boundedWest = Math.max(west, -180);
    const boundedEast = Math.min(east, 180);
    const boundedSouth = Math.max(south, -90);
    const boundedNorth = Math.min(north, 90);

    return `${boundedWest},${boundedSouth},${boundedEast},${boundedNorth}`;
  } catch (error) {
    console.error('Error creating viewbox:', error);
    throw error;
  }
};

/**
 * Enhanced geocoding with better address parsing and error handling
 */
export const geocodeAddress = async (address, userLocation = null) => {
  try {
    const results = await searchLocations(address, {
      limit: 1,
      userLocation: userLocation,
      includeCategories: true,
      searchRadius: userLocation ? 25 : 50 // Smaller radius if we have user location
    });

    if (results.length > 0) {
      const result = results[0];
      return {
        coordinates: result.coordinates,
        formattedAddress: result.address,
        shortName: result.shortName,
        category: result.category,
        confidence: result.importance,
        details: result.details
      };
    }

    throw new Error('Address not found');
  } catch (error) {
    console.error('Geocoding error:', error);

    // Enhanced fallback with common Kenyan locations
    const fallbackLocations = {
      'westlands': [-1.2676, 36.8108],
      'karen': [-1.3197, 36.7070],
      'kilimani': [-1.2921, 36.7856],
      'lavington': [-1.2833, 36.7667],
      'kileleshwa': [-1.2833, 36.7833],
      'parklands': [-1.2500, 36.8500],
      'eastleigh': [-1.2833, 36.8500],
      'south c': [-1.3167, 36.8167],
      'south b': [-1.3000, 36.8167],
      'langata': [-1.3667, 36.7667],
      'kibera': [-1.3167, 36.7833],
      'mathare': [-1.2667, 36.8667],
      'kasarani': [-1.2167, 36.9000],
      'embakasi': [-1.3167, 36.9000],
      'dagoretti': [-1.3000, 36.7500]
    };

    const searchKey = address.toLowerCase();
    for (const [location, coords] of Object.entries(fallbackLocations)) {
      if (searchKey.includes(location)) {
        return {
          coordinates: coords,
          formattedAddress: `${location.charAt(0).toUpperCase() + location.slice(1)}, Nairobi, Kenya`,
          shortName: location.charAt(0).toUpperCase() + location.slice(1),
          category: 'area',
          confidence: 0.7,
          details: { suburb: location, city: 'Nairobi' },
          fallback: true
        };
      }
    }

    // Default fallback to Nairobi coordinates
    return {
      coordinates: [-1.2921, 36.8219],
      formattedAddress: address,
      shortName: address,
      category: 'other',
      confidence: 0.1,
      error: 'Could not geocode address, using default location'
    };
  }
};

/**
 * Get address suggestions with enhanced search and error handling
 */
export const getAddressSuggestions = async (query, userLocation = null) => {
  try {
    return await searchLocations(query, {
      limit: 6, // Reduced limit to avoid rate limiting
      userLocation: userLocation,
      includeCategories: true,
      searchRadius: userLocation ? 25 : 50
    });
  } catch (error) {
    console.error('Address suggestions error:', error);
    return [];
  }
};

/**
 * Search for nearby places of interest with error handling
 */
export const getNearbyPlaces = async (userLocation, categories = [], radius = 5) => {
  try {
    const allPlaces = [];

    // If no specific categories, search for common useful places
    const defaultCategories = ['restaurants', 'hospitals', 'schools', 'banks'];
    const searchCategories = categories.length > 0 ? categories : defaultCategories;

    // Limit concurrent requests to avoid rate limiting
    for (const category of searchCategories.slice(0, 3)) { // Only first 3 categories
      try {
        const places = await searchPlacesByCategory(category, userLocation, radius);
        allPlaces.push(...places.slice(0, 2)); // Top 2 from each category

        // Small delay between category searches
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn(`Error searching for ${category}:`, error);
      }
    }

    // Remove duplicates and sort by distance
    const uniquePlaces = allPlaces.filter((place, index, self) =>
      index === self.findIndex(p => p.id === place.id)
    );

    return uniquePlaces.sort((a, b) => a.distance - b.distance).slice(0, 10);

  } catch (error) {
    console.error('Nearby places error:', error);
    return [];
  }
};

// Re-export existing functions
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'GenHands-Charity-App/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();

    if (data.display_name) {
      return {
        address: data.display_name,
        details: data.address || {}
      };
    }

    throw new Error('Location not found');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      details: {},
      error: 'Could not reverse geocode coordinates'
    };
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return parseFloat(distance.toFixed(1));
};

export const calculateEstimatedTime = (distanceKm, mode = 'driving') => {
  const speeds = {
    walking: 5,    // km/h
    cycling: 15,   // km/h
    driving: 25,   // km/h (city traffic)
    motorcycle: 30 // km/h
  };

  const speed = speeds[mode] || speeds.driving;
  const timeInHours = distanceKm / speed;
  const minutes = Math.round(timeInHours * 60);

  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
};

export const getRoute = async (startCoords, endCoords, profile = 'driving-car') => {
  try {
    return {
      coordinates: [startCoords, endCoords],
      distance: calculateDistance(startCoords[0], startCoords[1], endCoords[0], endCoords[1]),
      duration: calculateEstimatedTime(
        calculateDistance(startCoords[0], startCoords[1], endCoords[0], endCoords[1])
      ),
      type: 'straight-line'
    };
  } catch (error) {
    console.error('Route calculation error:', error);
    return null;
  }
};

export const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

export const getCurrentLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        coordinates: [-1.2921, 36.8219],
        accuracy: null,
        error: 'Geolocation not supported'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: [position.coords.latitude, position.coords.longitude],
          accuracy: position.coords.accuracy,
          error: null
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve({
          coordinates: [-1.2921, 36.8219],
          accuracy: null,
          error: error.message
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
};

export default {
  searchLocations,
  searchPlacesByCategory,
  getPlaceDetails,
  getNearbyPlaces,
  geocodeAddress,
  getAddressSuggestions,
  reverseGeocode,
  calculateDistance,
  calculateEstimatedTime,
  getRoute,
  isValidCoordinates,
  getCurrentLocation
};
