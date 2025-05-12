
import { useState, useEffect } from 'react';
import { LoginAttempt } from '../types';

export const useLoginStorage = () => {
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);

  // Load login attempts from localStorage
  useEffect(() => {
    try {
      const storedLoginAttempts = localStorage.getItem('loginAttempts');
      if (storedLoginAttempts) {
        setLoginAttempts(JSON.parse(storedLoginAttempts));
      }
    } catch (e) {
      console.error('Error loading login attempts from localStorage:', e);
    }
  }, []);

  // Save login attempts to localStorage
  const saveLoginAttempts = (newAttempts: LoginAttempt[]) => {
    try {
      localStorage.setItem('loginAttempts', JSON.stringify(newAttempts));
      setLoginAttempts(newAttempts);
    } catch (e) {
      console.error('Error saving login attempts to localStorage:', e);
    }
  };

  // Reset login attempts
  const resetLoginAttempts = () => {
    setLoginAttempts([]);
    localStorage.removeItem('loginAttempts');
  };

  return {
    loginAttempts,
    saveLoginAttempts,
    resetLoginAttempts
  };
};
