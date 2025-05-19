
import React, { createContext, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuthSession } from './useAuthSession';
import { useAuthFunctions } from './useAuthFunctions';
import { useLoginAttempts } from './useLoginAttempts';
import { useActivityMonitor } from './useActivityMonitor';
import { useAuthPlans } from './useAuthPlans';
import { AuthUser, PlanType, AuthContextType } from './types';

// Create the auth context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Get session and user state from useAuthSession hook
  const { session, user, loading, setSession, setUser } = useAuthSession();
  
  // Get Auth-related functionality
  const {
    signIn,
    signUp,
    signOut,
  } = useAuthFunctions({ session, user, setSession, setUser });
  
  // Additional auth-related state/functions
  const isAuthenticated = !!session && !!user;
  
  // Get login security functionality
  const {
    loginAttempts,
    securityStatus,
    checkFailedLoginAttempts,
    getFailedLoginAttempts,
    resetFailedLoginAttempts,
    saveLoginAttempt
  } = useLoginAttempts();
  
  const failedLoginAttempts = getFailedLoginAttempts();
  
  // Get activity monitoring functionality - Fix: Pass required parameters
  const { lastActivity, updateLastActivity } = useActivityMonitor(user, signOut);
  
  // Get plan-related functionality - Fix: Pass the correct user parameter
  const {
    userPlan,
    apiToken,
    apiRequestsRemaining,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets,
  } = useAuthPlans(user ? user as AuthUser : null);
  
  // Update user's last activity when they interact with the app
  useEffect(() => {
    if (isAuthenticated) {
      updateLastActivity();
    }
  }, [isAuthenticated, updateLastActivity]);

  // Provide context value
  const contextValue: AuthContextType = {
    session,
    user: user as AuthUser,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    lastActivity,
    updateLastActivity,
    securityStatus,
    failedLoginAttempts,
    resetFailedLoginAttempts,
    userPlan,
    apiToken,
    apiRequestsRemaining,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets,
    // Mock function for password strength
    passwordStrength: (password: string) => {
      return { score: password.length > 8 ? 4 : 2, feedback: '' };
    }
  };
  
  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
