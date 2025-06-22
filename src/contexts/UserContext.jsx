import React, { createContext, useContext } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';

const UserContext = createContext();

/**
 * User Context Provider component
 * Provides current user data to all child components
 */
export const UserProvider = ({ children }) => {
  const userState = useCurrentUser();

  return (
    <UserContext.Provider value={userState}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to use the User Context
 * @returns {Object} User state including user data, loading, error, etc.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
