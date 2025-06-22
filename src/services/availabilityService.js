import http from './httpService';

const availabilityService = {
  // Create or update availability
  setAvailability: async (availabilityData) => {
    const response = await http.post('/availability', availabilityData);
    return response.data;
  },

  // Get current user's availability
  getMyAvailability: async () => {
    const response = await http.get('/availability/my');
    return response.data ? response.data.data : null;
  },

  // Delete current user's availability
  deleteAvailability: async () => {
    const response = await http.delete('/availability');
    return response.data;
  },

  // Add temporary unavailability
  addUnavailability: async (unavailabilityData) => {
    const response = await http.post('/availability/unavailable', unavailabilityData);
    return response.data;
  },

  // Check availability at specific time
  checkAvailability: async (checkData) => {
    const response = await http.post('/availability/check', checkData);
    return response.data;
  },

  // Remove unavailability period (if needed)
  removeUnavailability: async (unavailabilityId) => {
    const response = await http.delete(`/availability/unavailable/${unavailabilityId}`);
    return response.data;
  },
};

export default availabilityService;
