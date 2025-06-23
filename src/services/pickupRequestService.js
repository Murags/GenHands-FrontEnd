import httpService from './httpService';

/**
 * Fetches donation pickup requests from the API.
 *
 * @param {object} params - The query parameters for the request.
 * @param {number} [params.lat] - The latitude for geospatial search.
 * @param {number} [params.lng] - The longitude for geospatial search.
 * @param {number} [params.radius] - The search radius in kilometers.
 * @param {string} [params.status] - Filter by status (e.g., 'available').
 * @param {string} [params.priority] - Filter by priority (e.g., 'high').
 * @returns {Promise<object>} The API response containing the pickup requests.
 */
const getPickupRequests = async (params = {}) => {
  const response = await httpService.get('/donations/pickup-requests', { params });
  return response.data;
};

/**
 * Updates the status of a specific pickup request.
 *
 * @param {string} pickupId - The ID of the pickup request to update.
 * @param {string} status - The new status to set.
 * @returns {Promise<object>} The API response with the updated pickup request.
 */
const updatePickupStatus = async (pickupId, status) => {
  const response = await httpService.patch(`/donations/pickup-requests/${pickupId}/status`, { status });
  return response.data;
};

/**
 * Fetches all pickups assigned to the current volunteer.
 *
 * @param {object} params - The query parameters for the request.
 * @param {string} [params.status] - Filter by status (e.g., 'accepted', 'en_route_pickup').
 * @returns {Promise<object>} The API response containing the assigned pickup requests.
 */
const getMyPickups = async (params = {}) => {
  const response = await httpService.get('/donations/my-pickups', { params });
  return response.data;
};

const pickupRequestService = {
  getPickupRequests,
  updatePickupStatus,
  getMyPickups,
};

export default pickupRequestService;
