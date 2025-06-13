
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuthSession } from './useAuthSession';
import { useAuthPlans } from './useAuthPlans';
import { usePasswordStrength } from './hooks/usePasswordStrength';
import { AuthContextType, User, PlanType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [passwordResetEmailSent, setPasswordResetEmailSent] = useState(false);
  
  const {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated,
    lastActivity: lastActivityTimestamp,
    updateLastActivity,
    securityStatus,
    failedLoginAttempts,
    resetFailedLoginAttempts,
    checkSubscriptionStatus,
    isLoading
  } = useAuthSession();

  const {
    userPlan,
    apiRequestsUsed,
    apiRequestsRemaining,
    upgradeUserPlan,
    generateApiToken,
    createCheckoutSession,
    openCustomerPortal
  } = useAuthPlans(user);

  const { passwordStrength } = usePasswordStrength();

  const canAddMoreWallets = (currentWallets: number): boolean => {
    if (userPlan === 'premium') return true;
    return currentWallets < 3;
  };

  // Alias functions for backward compatibility
  const login = signIn;
  const register = signUp;
  const logout = signOut;

  // Convert timestamp to Date for context
  const lastActivity = lastActivityTimestamp ? new Date(lastActivityTimestamp) : null;

  const value: AuthContextType = {
    isRegistering,
    setIsRegistering,
    isLoggingIn,
    setIsLoggingIn,
    isLoggingOut,
    setIsLoggingOut,
    isUpdating,
    setIsUpdating,
    apiToken,
    setApiToken,
    tempPassword,
    setTempPassword,
    passwordResetEmailSent,
    setPasswordResetEmailSent,
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    lastActivity,
    updateLastActivity,
    securityStatus,
    failedLoginAttempts,
    resetFailedLoginAttempts,
    userPlan,
    apiRequestsUsed,
    apiRequestsRemaining,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets,
    passwordStrength,
    createCheckoutSession,
    openCustomerPortal,
    checkSubscriptionStatus,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
