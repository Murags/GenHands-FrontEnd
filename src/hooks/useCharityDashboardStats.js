import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useCharityDashboardStats = () => {
  return useQuery({
    queryKey: ['charity-dashboard-stats'],
    queryFn: dashboardService.getDashboardStats,
    staleTime: 30000,
    cacheTime: 300000,
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('Failed to fetch charity dashboard stats:', error);
    }
  });
};

export default useCharityDashboardStats;
