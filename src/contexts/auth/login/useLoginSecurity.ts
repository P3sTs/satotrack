
import { useState, useEffect } from 'react';
import { LoginAttempt } from '../types';

// Constants for login security
const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_COOLDOWN_PERIOD = 15 * 60 * 1000; // 15 minutes in ms

export const useLoginSecurity = (loginAttempts: LoginAttempt[]) => {
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'danger'>('secure');

  // Check if there are too many failed login attempts for a specific email
  const checkFailedLoginAttempts = (email: string): boolean => {
    const now = Date.now();
    const recentAttempts = loginAttempts
      .filter(attempt => attempt.email === email && 
              !attempt.success && 
              (now - attempt.timestamp) < LOGIN_COOLDOWN_PERIOD);
    
    return recentAttempts.length >= MAX_LOGIN_ATTEMPTS;
  };
  
  // Get the number of recent failed login attempts
  const getFailedLoginAttempts = (): number => {
    const now = Date.now();
    return loginAttempts
      .filter(attempt => !attempt.success && 
              (now - attempt.timestamp) < LOGIN_COOLDOWN_PERIOD).length;
  };

  // Update security status based on failed login attempts
  useEffect(() => {
    const failedCount = getFailedLoginAttempts();
    if (failedCount >= MAX_LOGIN_ATTEMPTS - 1) {
      setSecurityStatus('danger');
    } else if (failedCount >= MAX_LOGIN_ATTEMPTS / 2) {
      setSecurityStatus('warning');
    } else {
      setSecurityStatus('secure');
    }
  }, [loginAttempts]);

  return {
    securityStatus,
    checkFailedLoginAttempts,
    getFailedLoginAttempts
  };
};
