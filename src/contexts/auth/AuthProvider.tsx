
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AuthError, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { AuthContextType, AuthUser, PlanType } from './types';
import { checkPasswordStrength } from './passwordUtils';
import { useAuthSession } from './useAuthSession';
import { useActivityMonitor } from './useActivityMonitor';
import { useLoginAttempts } from './useLoginAttempts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Função para converter User para AuthUser (garantindo email)
const convertToAuthUser = (user: User | null): AuthUser | null => {
  if (!user || !user.email) return null;
  return { ...user, email: user.email };
};

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session, user: supabaseUser, loading, setSession } = useAuthSession();
  const [user, setUser] = useState<AuthUser | null>(convertToAuthUser(supabaseUser));
  const [userPlan, setUserPlan] = useState<PlanType>('free');
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [apiRequestsRemaining, setApiRequestsRemaining] = useState<number>(1000);

  // Atualiza o user quando supabaseUser mudar
  React.useEffect(() => {
    const authUser = convertToAuthUser(supabaseUser);
    setUser(authUser);
    
    // Fetch user plan from database if user exists
    if (authUser?.id) {
      fetchUserPlan(authUser.id);
    }
  }, [supabaseUser]);

  // Fetch user plan from database
  const fetchUserPlan = async (userId: string) => {
    try {
      // Use type assertion to work around the type checking
      const { data, error } = await (supabase
        .from('user_plans' as any)
        .select('plan_type, api_token, api_requests')
        .eq('user_id', userId)
        .single());
      
      if (error) {
        console.error('Error fetching user plan:', error);
        return;
      }
      
      if (data) {
        setUserPlan(data.plan_type as PlanType);
        setApiToken(data.api_token);
        setApiRequestsRemaining(data.api_requests || 1000);
      }
    } catch (error) {
      console.error('Error in fetchUserPlan:', error);
    }
  };

  const { 
    loginAttempts, 
    checkFailedLoginAttempts, 
    getFailedLoginAttempts, 
    resetFailedLoginAttempts, 
    saveLoginAttempt,
    securityStatus: loginSecurityStatus 
  } = useLoginAttempts();

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    if (checkFailedLoginAttempts(email)) {
      toast({
        title: "Conta bloqueada",
        description: `Muitas tentativas de login. Tente novamente em 15 minutos.`,
        variant: "destructive"
      });
      throw new Error("Conta temporariamente bloqueada por muitas tentativas");
    }

    try {
      const sanitizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithPassword({ 
        email: sanitizedEmail, 
        password 
      });
      
      if (error) {
        saveLoginAttempt(sanitizedEmail, false);
        throw error;
      }
      
      saveLoginAttempt(sanitizedEmail, true);
      updateLastActivity();
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao entrar:", authError);
      
      // Msg de erro amigável
      if (authError.message.includes('Invalid login')) {
        throw new Error("Email ou senha incorretos");
      } else {
        throw new Error(`Erro ao entrar: ${authError.message}`);
      }
    }
  };

  // Logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setLastActivity(null);
      localStorage.removeItem('lastActivity');
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao sair:", authError);
      throw new Error(`Erro ao sair: ${authError.message}`);
    }
  };

  // Registro com validação de senha
  const signUp = async (email: string, password: string, fullName: string) => {
    // Verifica força da senha
    const { score, feedback } = checkPasswordStrength(password);
    if (score < 3) {
      throw new Error(`Senha insegura: ${feedback}`);
    }

    try {
      const sanitizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signUp({ 
        email: sanitizedEmail, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para ativar sua conta.",
      });
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao registrar:", authError);
      
      // Melhor tratamento de erros
      if (authError.message.includes('already registered')) {
        throw new Error("Este email já está registrado");
      } else if (authError.message.includes('password')) {
        throw new Error("A senha não atende aos requisitos de segurança");
      } else {
        throw new Error(`Erro ao criar conta: ${authError.message}`);
      }
    }
  };

  // Upgrade user plan to premium
  const upgradeUserPlan = async () => {
    // In a real app, this would handle payment processing
    // For demo purposes, we'll just update the plan in the database
    try {
      if (!user) throw new Error('User not authenticated');
      
      // Use type assertion to work around the type checking
      const { error } = await (supabase
        .from('user_plans' as any)
        .upsert({ 
          user_id: user.id, 
          plan_type: 'premium',
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setUserPlan('premium');
      toast({
        title: "Plano atualizado",
        description: "Você agora é um usuário Premium! Aproveite todos os recursos.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error upgrading user plan:', error);
      toast({
        title: "Erro ao atualizar plano",
        description: "Não foi possível atualizar para o plano Premium. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Generate API token for premium users
  const generateApiToken = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      if (userPlan !== 'premium') throw new Error('API tokens are only available for premium users');
      
      // Generate a random token
      const token = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      
      // Use type assertion to work around the type checking
      const { error } = await (supabase
        .from('user_plans' as any)
        .upsert({ 
          user_id: user.id, 
          api_token: token,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setApiToken(token);
      toast({
        title: "API Token gerado",
        description: "Seu novo token de API foi gerado com sucesso.",
      });
      
      return token;
    } catch (error) {
      console.error('Error generating API token:', error);
      toast({
        title: "Erro ao gerar token",
        description: error instanceof Error ? error.message : "Não foi possível gerar o token de API.",
        variant: "destructive"
      });
      return '';
    }
  };

  const { 
    lastActivity, 
    updateLastActivity, 
    securityStatus: activitySecurityStatus, 
    setSecurityStatus,
    setLastActivity
  } = useActivityMonitor(user, signOut);

  // Combine security statuses from different sources
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

  // Calculate if user can add more wallets based on their plan
  const canAddMoreWallets = userPlan === 'premium' || true;

  return (
    <AuthContext.Provider value={{
      session,
      user,
      signIn,
      signUp,
      signOut,
      loading,
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};
