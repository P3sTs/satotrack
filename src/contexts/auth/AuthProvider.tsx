
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser } from './types';
import { checkPasswordStrength } from './passwordUtils';
import { useAuthSession } from './useAuthSession';
import { useActivityMonitor } from './useActivityMonitor';
import { useLoginAttempts } from './useLoginAttempts';
import { convertToAuthUser } from './userUtils';
import { useAuthPlans } from './useAuthPlans';
import { useAuthFunctions } from './useAuthFunctions';

// Criar o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente Provider para o contexto de autenticação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Usar o hook de sessão para gerenciar o estado de autenticação
  const { session, user: supabaseUser, loading, setSession } = useAuthSession();
  const [user, setUser] = useState<AuthUser | null>(null);

  // Inicializar monitoramento de tentativas de login
  const { 
    loginAttempts, 
    checkFailedLoginAttempts, 
    getFailedLoginAttempts, 
    resetFailedLoginAttempts, 
    saveLoginAttempt,
    securityStatus: loginSecurityStatus 
  } = useLoginAttempts();

  // Monitoramento de atividade para segurança
  const { 
    lastActivity, 
    updateLastActivity, 
    securityStatus: activitySecurityStatus,
    setLastActivity
  } = useActivityMonitor(user, async () => await authFunctions.signOut());

  // Planos de usuário e recursos premium
  const {
    userPlan,
    apiToken,
    apiRequestsRemaining,
    fetchUserPlan,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets,
    isLoading: plansLoading
  } = useAuthPlans(user);

  // Funções de autenticação
  const authFunctions = useAuthFunctions(
    updateLastActivity,
    saveLoginAttempt,
    checkFailedLoginAttempts
  );

  // Atualizar estado do usuário quando supabaseUser muda
  useEffect(() => {
    const authUser = convertToAuthUser(supabaseUser);
    
    if (authUser) {
      // Adicionar informações de segurança ao usuário
      const enhancedUser = {
        ...authUser,
        securityStatus: determineSecurityStatus()
      };
      
      setUser(enhancedUser);
      
      // Buscar plano do usuário se o usuário existir
      if (enhancedUser.id) {
        fetchUserPlan(enhancedUser.id);
      }
    } else {
      setUser(null);
    }
  }, [supabaseUser, loginSecurityStatus, activitySecurityStatus]);

  // Combinar status de segurança de diferentes fontes
  const determineSecurityStatus = (): 'secure' | 'warning' | 'danger' => {
    if (loginSecurityStatus === 'danger' || activitySecurityStatus === 'danger') {
      return 'danger';
    } else if (loginSecurityStatus === 'warning' || activitySecurityStatus === 'warning') {
      return 'warning';
    } else {
      return 'secure';
    }
  };

  const securityStatus = determineSecurityStatus();

  // Efeito para atualizar atividade periodicamente quando autenticado
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      updateLastActivity();
    }, 300000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [user, updateLastActivity]);

  // Combinar todos os valores do contexto
  const contextValue: AuthContextType = {
    session,
    user,
    signIn: authFunctions.signIn,
    signUp: authFunctions.signUp,
    signOut: authFunctions.signOut,
    loading: loading || plansLoading,
    isAuthenticated: !!user,
    passwordStrength: checkPasswordStrength,
    lastActivity,
    updateLastActivity,
    securityStatus,
    failedLoginAttempts: getFailedLoginAttempts(),
    resetFailedLoginAttempts,
    upgradeUserPlan,
    userPlan,
    canAddMoreWallets,
    generateApiToken,
    apiToken,
    apiRequestsRemaining
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportar o contexto para uso em outros componentes
export { AuthContext };
