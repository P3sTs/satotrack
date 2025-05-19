
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuthSession } from './useAuthSession';
import { useAuthFunctions } from './useAuthFunctions';
import { useLoginAttempts } from './useLoginAttempts';
import { useActivityMonitor } from './useActivityMonitor';
import { useAuthPlans } from './useAuthPlans';
import { AuthUser, PlanType, AuthContextType } from './types';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { sendPriceAlert } from '@/services/notifications/alerts';

// Create the auth context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Get session and user state from useAuthSession hook
  const { session, user, loading, setSession, setUser } = useAuthSession();
  const location = useLocation();
  
  // Additional auth-related state/functions
  const isAuthenticated = !!session && !!user;
  
  // Create a signOut stub function that will be replaced by the actual function from useAuthFunctions
  const [signOutFn, setSignOutFn] = useState<() => Promise<void>>(async () => {
    console.log("Stub signOut called - this shouldn't happen");
  });
  
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

  // Mostrar mensagem de boas-vindas quando o usuário faz login
  useEffect(() => {
    if (isAuthenticated && lastActivity && Date.now() - lastActivity < 3000) {
      const displayName = user?.email?.split('@')[0] || 'usuário';
      
      // Mostrar toast de boas-vindas
      toast({
        title: `Bem-vindo, ${displayName}!`,
        description: `Você está conectado como ${isPremium ? 'usuário premium' : 'usuário gratuito'}.`,
      });

      // Verificar se há alertas importantes para o usuário
      const checkImportantAlerts = async () => {
        if (user?.id) {
          // Por exemplo, verificar mudanças significativas de preço
          const priceChange = 7.5; // Em um caso real, isso viria de uma API
          if (Math.abs(priceChange) > 5) {
            await sendPriceAlert(
              user.id,
              priceChange,
              65000, // Preço atual do Bitcoin
              isPremium // Incluir análise de IA apenas para usuários premium
            );
          }
        }
      };
      
      if (isPremium) {
        checkImportantAlerts();
      }
    }
  }, [isAuthenticated, lastActivity, user, isPremium]);
  
  // Update user's last activity when they interact with the app
  useEffect(() => {
    if (isAuthenticated) {
      updateLastActivity();
    }
  }, [isAuthenticated, location.pathname, updateLastActivity]);

  // Função para avaliar a força da senha com regras mais estritas
  const passwordStrength = useCallback((password: string) => {
    if (!password) {
      return { score: 0, feedback: 'Senha não pode estar vazia' };
    }

    let score = 0;
    let feedback = '';

    // Comprimento mínimo
    if (password.length >= 12) {
      score += 2;
    } else if (password.length >= 8) {
      score += 1;
    } else {
      score = 0;
      feedback = 'Senha muito curta';
      return { score, feedback };
    }

    // Verificar combinação de caracteres
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

    if (hasLowercase) score += 0.5;
    if (hasUppercase) score += 0.5;
    if (hasNumbers) score += 0.5;
    if (hasSpecialChars) score += 0.5;

    // Senhas comuns ou padrões
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome', 'senha'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score = Math.min(score, 1);
      feedback = 'Senha muito comum ou previsível';
    }

    // Avaliação final
    if (score < 1) {
      feedback = 'Senha muito fraca';
    } else if (score < 2) {
      feedback = 'Senha fraca';
    } else if (score < 3) {
      feedback = 'Senha razoável';
    } else if (score < 4) {
      feedback = 'Senha forte';
    } else {
      feedback = 'Senha muito forte';
    }

    return { score, feedback };
  }, []);

  const isPremium = userPlan === 'premium';

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
    passwordStrength
  };
  
  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
