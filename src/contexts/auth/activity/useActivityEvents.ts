
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';

export const useActivityEvents = (user: User | null, onActivity: () => void) => {
  // Setup event listeners for user activity
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleUserActivity = () => {
      if (user) onActivity();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [user, onActivity]);
};
