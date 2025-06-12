
import React, { createContext, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuthSession } from './useAuthSession';
import { useAuthFunctions } from './useAuthFunctions';
import { useLoginAttempts } from './useLoginAttempts';
import { useActivityMonitor } from './useActivityMonitor';
import { useAuthPlans } from './useAuthPlans';
import { AuthUser, PlanType, AuthContextType } from './types';
import { useLocation } from 'react-router-dom';
import { useWelcomeToast } from './hooks/useWelcomeToast';
import { usePasswordStrength } from './hooks/usePasswordStrength';
import { useUserActivityMonitoring } from './hooks/useUserActivityMonitoring';

// Create the auth context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Get session and user state from useAuthSession hook
  const { session, user, loading, setSession, setUser } = useAuthSession();
  const location = useLocation();
  
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
  
  // Criar um callback memoizado para updateLastActivity
  const updateLastActivity = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem('lastActivity', now);
  }, []);
  
  // Get activity monitoring functionality
  const { lastActivity } = useActivityMonitor(user, async () => {
    // Stub function for signOut - será substituído abaixo
  });
  
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
  
  const failedLoginAttempts = getFailedLoginAttempts();
  
  // Get plan-related functionality
  const {
    userPlan,
    apiToken,
    apiRequestsRemaining,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets,
    isLoading,
    checkSubscriptionStatus,
    createCheckoutSession,
    openCustomerPortal
  } = useAuthPlans(user ? user as AuthUser : null);

  // Boas-vindas e alertas
  useWelcomeToast(isAuthenticated, lastActivity, user as AuthUser, userPlan);
  
  // Monitoramento de atividade do usuário
  useUserActivityMonitoring(isAuthenticated, updateLastActivity, location);
  
  // Hook de força de senha
  const { passwordStrength } = usePasswordStrength();

  // Provide context value
  const contextValue: AuthContextType = {
    session,
    user: user as AuthUser,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    lastActivity: lastActivity ? new Date(lastActivity) : null,
    updateLastActivity,
    securityStatus,
    failedLoginAttempts,
    resetFailedLoginAttempts,
    userPlan,
    apiToken,
    apiRequestsRemaining,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets: () => canAddMoreWallets(0),
    passwordStrength,
    createCheckoutSession,
    openCustomerPortal,
    checkSubscriptionStatus,
    isLoading
  };
  
  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
