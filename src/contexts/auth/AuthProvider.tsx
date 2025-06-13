import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuthFunctions } from './useAuthFunctions';
import { useAuthSession } from './useAuthSession';
import { useAuthPlans } from './useAuthPlans';
import { usePasswordStrength } from './hooks/usePasswordStrength';
import { AuthContextType, User, PlanType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
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
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    userPlan,
    apiRequestsUsed,
    apiRequestsRemaining,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets,
    passwordStrength,
    createCheckoutSession,
    openCustomerPortal,
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
