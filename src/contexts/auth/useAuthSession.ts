
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { useAuthFunctions } from './useAuthFunctions';
import { useActivityMonitor } from './useActivityMonitor';
import { useLoginAttempts } from './useLoginAttempts';
import { useAuthEvents } from './hooks/useAuthEvents';
import { useUserInitialization } from './hooks/useUserInitialization';
import { useGuestAccess } from '@/hooks/useGuestAccess';

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

  // User initialization
  const { initializeNewUser } = useUserInitialization();
  
  // Guest access
  const guestAccess = useGuestAccess();

  // Auth events handling - fix the function signature
  const { setupAuthStateListener } = useAuthEvents({
    setSession,
    setUser,
    setLoading,
    initializeNewUser: (user: User) => initializeNewUser(user.id) // Pass user.id to the function
  });

  const isAuthenticated = Boolean(session && user);
  const isLoading = loading || authLoading;
  const failedLoginAttempts = getFailedLoginAttempts();
  
  // Modo guest vem do hook dedicado e independe do user
  const isGuestMode = guestAccess.isGuestMode;
  
  console.log('🏗️ useAuthSession state:', {
    hasUser: !!user,
    hasSession: !!session,
    isAuthenticated,
    isGuestMode,
    loading
  });

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

  // Session initialization
  useEffect(() => {
    console.log("Inicializando useAuthSession...");
    
    const subscription = setupAuthStateListener();

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log("Verificando sessão existente...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
        }
        
        console.log("Sessão inicial encontrada:", !!initialSession);
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
  }, [setupAuthStateListener]);

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
    isGuestMode,
    ...guestAccess,
  };
};
