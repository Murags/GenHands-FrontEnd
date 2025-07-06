import httpService from './httpService';

const adminDashboardService = {
  // Get overview data with key metrics
  async getOverview(timeframe = '30d') {
    const response = await httpService.get('/admin/dashboard/overview', {
      params: { timeframe }
    });
    return response.data;
  },

  // Get supply and demand analysis
  async getSupplyDemand(timeframe = '30d') {
    const response = await httpService.get('/admin/dashboard/supply-demand', {
      params: { timeframe }
    });
    return response.data;
  },

  // Get operational metrics
  async getOperationalMetrics(timeframe = '30d') {
    const response = await httpService.get('/admin/dashboard/operational-metrics', {
      params: { timeframe }
    });
    return response.data;
  },

  // Get user analytics
  async getUserAnalytics(timeframe = '30d') {
    const response = await httpService.get('/admin/dashboard/user-analytics', {
      params: { timeframe }
    });
    return response.data;
  },

  // Get donation trends
  async getDonationTrends(timeframe = '30d') {
    const response = await httpService.get('/admin/dashboard/donation-trends', {
      params: { timeframe }
    });
    return response.data;
  }
};

export default adminDashboardService;
