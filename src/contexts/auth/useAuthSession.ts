
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { useAuthFunctions } from './useAuthFunctions';
import { useActivityMonitor } from './useActivityMonitor';
import { useLoginAttempts } from './useLoginAttempts';
import { initializeUserData } from './userInitialization';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Activity monitoring
  const {
    lastActivity,
    updateLastActivity,
    securityStatus
  } = useActivityMonitor();

  // Login attempts tracking
  const {
    resetFailedLoginAttempts,
    saveLoginAttempt,
    checkFailedLoginAttempts,
    getFailedLoginAttempts
  } = useLoginAttempts();

  // Auth functions
  const {
    signIn,
    signOut,
    signUp,
    loading: authLoading,
    setLoading: setAuthLoading
  } = useAuthFunctions(
    updateLastActivity,
    saveLoginAttempt,
    checkFailedLoginAttempts
  );

  const isAuthenticated = Boolean(session && user);
  const isLoading = loading || authLoading;
  const failedLoginAttempts = getFailedLoginAttempts();

  const updateProfile = async (data: any) => {
    if (!user) throw new Error('No user logged in');
    
    const { error } = await supabase.auth.updateUser({
      data
    });
    
    if (error) throw error;
  };

  const checkSubscriptionStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Auto-generate crypto wallets for new users
  const generateCryptoWallets = async (userId: string) => {
    try {
      console.log('Iniciando geração automática de carteiras cripto para usuário:', userId);
      
      const { data, error } = await supabase.functions.invoke('generate-crypto-wallets', {
        body: { userId },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        console.error('Erro ao gerar carteiras cripto:', error);
        throw error;
      }

      console.log('Carteiras cripto geradas com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro na geração de carteiras:', error);
      throw error;
    }
  };

  // Verificar a sessão inicial ao montar o componente
  useEffect(() => {
    console.log("Inicializando useAuthSession...");
    
    // Primeiro, configurar o listener de eventos de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, !!currentSession);
      
      // Log detalhado para debug
      if (currentSession) {
        console.log("Sessão ativa:", {
          hasAccessToken: !!currentSession.access_token,
          hasUser: !!currentSession.user,
          userEmail: currentSession.user?.email,
          expiresAt: currentSession.expires_at
        });
      }
      
      // Atualizar o estado local com a sessão e usuário
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      // Inicializar dados do usuário se for um registro novo
      if (event === 'SIGNED_UP' && currentSession?.user) {
        console.log("Novo usuário registrado, inicializando dados...");
        setTimeout(async () => {
          try {
            // Primeiro inicializar dados básicos do usuário
            await initializeUserData(currentSession.user.id);
            
            // Depois gerar carteiras cripto automaticamente
            await generateCryptoWallets(currentSession.user.id);
          } catch (error) {
            console.error('Erro na inicialização completa do usuário:', error);
          }
        }, 1000);
      }
      
      // Log quando usuário faz login
      if (event === 'SIGNED_IN' && currentSession) {
        console.log("Usuário logado com sucesso");
      }
      
      // Log quando usuário sai
      if (event === 'SIGNED_OUT') {
        console.log("Usuário deslogado");
      }
    });

    // Depois, verificar se há uma sessão ativa
    const checkSession = async () => {
      try {
        console.log("Verificando sessão existente...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
        }
        
        console.log("Sessão inicial encontrada:", !!initialSession);
        if (initialSession) {
          console.log("Detalhes da sessão inicial:", {
            hasAccessToken: !!initialSession.access_token,
            hasUser: !!initialSession.user,
            userEmail: initialSession.user?.email
          });
        }
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      console.log("Limpando subscription do useAuthSession");
      subscription.unsubscribe();
    };
  }, []);

  return { 
    session, 
    user, 
    loading,
    setSession, 
    setUser,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated,
    lastActivity,
    updateLastActivity,
    securityStatus,
    failedLoginAttempts,
    resetFailedLoginAttempts,
    checkSubscriptionStatus,
    isLoading,
    generateCryptoWallets
  };
};
