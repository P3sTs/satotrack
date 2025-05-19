
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useLocalStorage } from './activity/useLocalStorage';
import { useActivityEvents } from './activity/useActivityEvents';
import { useInactivityTimer } from './activity/useInactivityTimer';

export const useActivityMonitor = (
  user: User | null = null, 
  signOut: (() => Promise<void>) = async () => {}
) => {
  const [lastActivity, setLastActivity] = useState<number | null>(null);
  const { saveToLocalStorage, loadFromLocalStorage } = useLocalStorage();
  
  // Atualiza atividade do usuário
  const updateLastActivity = () => {
    const now = Date.now();
    setLastActivity(now);
    saveToLocalStorage('lastActivity', now);
  };

  // Add event listeners for user activity
  useActivityEvents(user, updateLastActivity);
  
  // Carrega dados de localStorage ao iniciar
  useEffect(() => {
    const storedLastActivity = loadFromLocalStorage<number | null>('lastActivity', null);
    if (storedLastActivity) {
      setLastActivity(storedLastActivity);
    }
  }, []);

  // Monitor inactivity and handle timeouts
  const { securityStatus, setSecurityStatus } = useInactivityTimer(
    !!user,
    lastActivity,
    signOut
  );

  return {
    lastActivity,
    updateLastActivity,
    securityStatus,
    setSecurityStatus,
    setLastActivity
  };
};
