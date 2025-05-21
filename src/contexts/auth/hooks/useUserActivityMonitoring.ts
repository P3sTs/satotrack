
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useUserActivityMonitoring = (
  isAuthenticated: boolean,
  updateLastActivity: () => void,
  location: ReturnType<typeof useLocation>
) => {
  // Update user's last activity when they interact with the app
  useEffect(() => {
    if (isAuthenticated) {
      updateLastActivity();
    }
  }, [isAuthenticated, location.pathname, updateLastActivity]);
};
