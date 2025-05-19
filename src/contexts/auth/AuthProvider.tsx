import React, { createContext, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuthSession } from './useAuthSession';
import { useAuthFunctions } from './useAuthFunctions';
import { useLoginAttempts } from './useLoginAttempts';
import { useActivityMonitor } from './useActivityMonitor';
import { useAuthPlans } from './useAuthPlans';
import { AuthUser, PlanType, SecuritySettings } from './types';

// Combine the context types to create the auth context type
export type AuthContextType = {
  // Session state
  session: Session | null;
  user: AuthUser | null;
  loading: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  
  // User state
  isAuthenticated: boolean;
  updateUserProfile: (profileData: Partial<AuthUser>) => Promise<void>;
  
  // Security methods
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
  securitySettings: SecuritySettings;
  
  // Login security
  loginAttempts: number;
  isLockedOut: boolean;
  lockoutEnd: Date | null;
  resetLoginAttempts: () => void;
  
  // Activity monitoring
  lastActivity: Date | null;
  updateLastActivity: () => void;
  
  // Plans and subscription features
  userPlan: PlanType;
  apiToken: string | null;
  apiRequestsRemaining: number;
  upgradeUserPlan: () => Promise<void>;
  generateApiToken: () => Promise<string>;
  canAddMoreWallets: (currentWallets: number) => boolean;
};

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
    forgotPassword,
    resetPassword,
    isAuthenticated,
    updateUserProfile,
    updateSecuritySettings,
    securitySettings,
  } = useAuthFunctions({ session, user, setSession, setUser });
  
  // Get login security functionality
  const {
    loginAttempts,
    isLockedOut,
    lockoutEnd,
    incrementLoginAttempts,
    resetLoginAttempts,
  } = useLoginAttempts(user?.id);
  
  // Get activity monitoring functionality
  const { lastActivity, updateLastActivity } = useActivityMonitor(user?.id);
  
  // Get plan-related functionality
  const {
    userPlan,
    apiToken,
    apiRequestsRemaining,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets,
  } = useAuthPlans(user);
  
  // Update user's last activity when they interact with the app
  useEffect(() => {
    if (isAuthenticated) {
      updateLastActivity();
    }
  }, [isAuthenticated, updateLastActivity]);
  
  // Provide authentication context to child components
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        resetPassword,
        isAuthenticated,
        updateUserProfile,
        updateSecuritySettings,
        securitySettings,
        loginAttempts,
        isLockedOut,
        lockoutEnd,
        resetLoginAttempts,
        lastActivity,
        updateLastActivity,
        userPlan,
        apiToken,
        apiRequestsRemaining,
        upgradeUserPlan,
        generateApiToken,
        canAddMoreWallets,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
