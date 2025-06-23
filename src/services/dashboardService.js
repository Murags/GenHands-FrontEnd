import httpService from './httpService';

const API_BASE_URL = '/donations/charity';

export const dashboardService = {
  getDashboardStats: async () => {
    try {
      const response = await httpService.get(`${API_BASE_URL}/dashboard-stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

export default dashboardService;
