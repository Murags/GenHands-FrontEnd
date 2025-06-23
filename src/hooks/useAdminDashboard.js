import { useState, useEffect, useCallback } from 'react';
import adminDashboardService from '../services/adminDashboardService';

// Generic hook for dashboard data fetching
export const useDashboardData = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { timeframe = '30d', refreshInterval = 300000, autoRefresh = false } = options; // 5 min default

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      switch (endpoint) {
        case 'overview':
          result = await adminDashboardService.getOverview(timeframe);
          break;
        case 'supply-demand':
          result = await adminDashboardService.getSupplyDemand(timeframe);
          break;
        case 'operational-metrics':
          result = await adminDashboardService.getOperationalMetrics(timeframe);
          break;
        case 'user-analytics':
          result = await adminDashboardService.getUserAnalytics(timeframe);
          break;
        case 'donation-trends':
          result = await adminDashboardService.getDonationTrends(timeframe);
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }

      setData(result.data);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err.response?.data?.message || err.message || `Failed to fetch ${endpoint} data`);
    } finally {
      setLoading(false);
    }
  }, [endpoint, timeframe]);

  useEffect(() => {
    fetchData();

    // Auto-refresh data if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchData, autoRefresh, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
};

// Specialized hooks for each dashboard section
export const useOverviewData = (options = {}) => {
  return useDashboardData('overview', options);
};

export const useSupplyDemandData = (options = {}) => {
  return useDashboardData('supply-demand', options);
};

export const useOperationalMetrics = (options = {}) => {
  return useDashboardData('operational-metrics', options);
};

export const useUserAnalytics = (options = {}) => {
  return useDashboardData('user-analytics', options);
};

export const useDonationTrends = (options = {}) => {
  return useDashboardData('donation-trends', options);
};

// Hook for multiple dashboard data sources
export const useMultipleDashboardData = (endpoints, options = {}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { timeframe = '30d', refreshInterval = 300000, autoRefresh = false } = options;

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const promises = endpoints.map(async (endpoint) => {
        let result;
        switch (endpoint) {
          case 'overview':
            result = await adminDashboardService.getOverview(timeframe);
            break;
          case 'supply-demand':
            result = await adminDashboardService.getSupplyDemand(timeframe);
            break;
          case 'operational-metrics':
            result = await adminDashboardService.getOperationalMetrics(timeframe);
            break;
          case 'user-analytics':
            result = await adminDashboardService.getUserAnalytics(timeframe);
            break;
          case 'donation-trends':
            result = await adminDashboardService.getDonationTrends(timeframe);
            break;
          default:
            throw new Error(`Unknown endpoint: ${endpoint}`);
        }
        return { endpoint, data: result.data };
      });

      const results = await Promise.allSettled(promises);
      const newData = {};

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          newData[result.value.endpoint] = result.value.data;
        } else {
          console.error(`Error fetching ${endpoints[index]}:`, result.reason);
        }
      });

      setData(newData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [endpoints, timeframe]);

  useEffect(() => {
    if (endpoints && endpoints.length > 0) {
      fetchAllData();

      // Auto-refresh data if enabled
      let interval;
      if (autoRefresh) {
        interval = setInterval(fetchAllData, refreshInterval);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [fetchAllData, autoRefresh, refreshInterval]);

  return { data, loading, error, refetch: fetchAllData };
};
