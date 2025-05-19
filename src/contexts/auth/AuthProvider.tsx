
import React, { createContext, useEffect, useState } from 'react';
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
  
  // Additional auth-related state/functions
  const isAuthenticated = !!session && !!user;
  
  // Create a signOut stub function that will be replaced by the actual function from useAuthFunctions
  const [signOutFn, setSignOutFn] = useState<() => Promise<void>>(async () => {});
  
  // Get login security functionality
  const {
    loginAttempts,
    securityStatus,
    checkFailedLoginAttempts,
    getFailedLoginAttempts,
    resetFailedLoginAttempts,
    saveLoginAttempt
  } = useLoginAttempts();
  
  // Get activity monitoring functionality with the signOut stub
  const { lastActivity, updateLastActivity } = useActivityMonitor(user, signOutFn);
  
  // Get Auth-related functionality
  const {
    signIn,
    signUp,
    signOut,
  } = useAuthFunctions(
    updateLastActivity, 
    saveLoginAttempt,
    checkFailedLoginAttempts
  );
  
  // Update the signOut function once it's available
  useEffect(() => {
    setSignOutFn(() => signOut);
  }, [signOut]);
  
  const failedLoginAttempts = getFailedLoginAttempts();
  
  // Get plan-related functionality
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
  }, [isAuthenticated, location.pathname, updateLastActivity]);

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
