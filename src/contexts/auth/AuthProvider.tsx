
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { AuthContextType } from './types';
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

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session, user, loading, setSession, setUser } = useAuthSession();

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

  const { 
    lastActivity, 
    updateLastActivity, 
    securityStatus: activitySecurityStatus, 
    setSecurityStatus 
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
      resetFailedLoginAttempts
    }}>
      {children}
    </AuthContext.Provider>
  );
};
