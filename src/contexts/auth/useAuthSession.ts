
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fix: Separar a lógica de redirecionamento para evitar loops
  const handleAuthRedirect = useCallback((event: string, currentSession: Session | null) => {
    if (event === 'SIGNED_IN' && currentSession) {
      // Redirect to dashboard on sign in, unless there's a specific redirect path
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } else if (event === 'SIGNED_OUT') {
      // On sign out, redirect to auth page
      navigate('/auth', { replace: true });
    }
  }, [navigate, location.state]);

  // Fix: Separar a verificação de sessão inicial
  const checkInitialSession = useCallback(async () => {
    try {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
      
      // Handle redirects based on current path if needed
      if (initialSession && location.pathname === '/auth') {
        navigate('/dashboard', { replace: true });
      } else if (!initialSession && 
                location.pathname !== '/' && 
                location.pathname !== '/home' && 
                location.pathname !== '/auth' && 
                location.pathname !== '/sobre' && 
                location.pathname !== '/privacidade' &&
                location.pathname !== '/planos') {
        // Save the current location to redirect back after authentication
        navigate('/auth', { 
          replace: true,
          state: { from: location }
        });
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      setLoading(false);
    }
  }, [navigate, location]);

  useEffect(() => {
    // Define o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Redirecionar apenas em eventos específicos de autenticação
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        handleAuthRedirect(event, session);
      }
    });

    // Verifica sessão inicial
    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [checkInitialSession, handleAuthRedirect]);

  return { session, user, loading, setSession, setUser };
};
