import httpService from './httpService';

const API_BASE_URL = '/auth';

const getUsers = async (role = null, status = null) => {
  const url = '/auth/users';
  const params = {};

  if (role) params.role = role;
  if (status) params.status = status;

  const config = Object.keys(params).length > 0 ? { params } : {};
  const response = await httpService.get(url, config);
  return response.data;
};

// Legacy function for backward compatibility - now uses getUsers internally
const getPendingVerificationUsers = async (role) => {
  return getUsers(role, 'pending');
};

const verifyUser = async ({ userId, approve }) => {
  const url = `/auth/verify/${userId}`;
  const data = { action: approve ? 'approve' : 'reject' };

  const response = await httpService.put(url, data);
  return response.data;
};

// New user profile service
export const userService = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await httpService.get(`${API_BASE_URL}/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Include existing functions for backward compatibility
  getUsers,
  getPendingVerificationUsers,
  verifyUser
};

// Export individual functions for backward compatibility
export {
  getUsers,
  getPendingVerificationUsers,
  verifyUser
};

export default userService;
