import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Clear error when needed
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Login
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await authService.login(credentials);
      authService.storeUserData(userData);

      toast.success('Login successful!');
      const redirectPath = authService.getRedirectPath(userData.role);
      navigate(redirectPath);

      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Register donor
  const registerDonor = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.registerDonor(userData);
      toast.success('Registration successful! Please log in.');
      navigate('/auth/signin');
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Register volunteer
  const registerVolunteer = useCallback(async (userData, documents) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.registerVolunteer(userData, documents);
      toast.success('Application submitted! Please wait for admin approval.');
      navigate('/auth/signin');
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Register charity
  const registerCharity = useCallback(async (charityData, documents) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.registerCharity(charityData, documents);
      toast.success('Application submitted! Please wait for admin approval.');
      navigate('/auth/signin');
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    toast.success('Logged out successfully!');
    navigate('/');
  }, [navigate]);

  // Check authentication status
  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  // Get current role
  const getCurrentRole = useCallback(() => {
    return authService.getCurrentRole();
  }, []);

  // Get donor info
  const getDonorInfo = useCallback(() => {
    return authService.getDonorInfo();
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    login,
    registerDonor,
    registerVolunteer,
    registerCharity,
    logout,
    clearError,

    // Getters
    isAuthenticated,
    getCurrentRole,
    getDonorInfo,
  };
};

// Hook for password reset functionality
export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.requestPasswordReset(email);
      setSuccess(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
      toast.success('Password reset successful!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    success,
    requestPasswordReset,
    resetPassword,
    clearMessages,
  };
};
