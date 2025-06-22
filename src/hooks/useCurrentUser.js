import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

/**
 * Custom hook for managing current user data
 * @returns {Object} User data, loading state, error state, and refetch function
 */
export const useCurrentUser = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await userService.getCurrentUser();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - user data doesn't change frequently
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // Don't refetch on window focus for user data
    refetchOnMount: true, // Refetch when component mounts
  });

  return {
    user,
    loading: isLoading,
    error: isError ? error : null,
    refetch,
    isAuthenticated: !!user && !isError
  };
};

export default useCurrentUser;
