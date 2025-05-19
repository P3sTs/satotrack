
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

  // Função para gerenciar redirecionamentos após eventos de autenticação
  const handleAuthRedirect = useCallback((event: string, currentSession: Session | null) => {
    console.log("Auth event handler:", event, !!currentSession);
    
    if (event === 'SIGNED_IN' && currentSession) {
      // Redirecionar para dashboard quando logado
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } else if (event === 'SIGNED_OUT') {
      // Redirecionar para página de autenticação quando deslogado
      navigate('/auth', { replace: true });
    }
  }, [navigate, location.state]);

  // Verificar se rota atual é pública (não requer autenticação)
  const isPublicRoute = (path: string): boolean => {
    const publicRoutes = ['/', '/home', '/auth', '/sobre', '/privacidade', '/planos', '/mercado', '/crypto'];
    return publicRoutes.some(route => path === route);
  };

  // Verificar a sessão inicial ao montar o componente
  useEffect(() => {
    console.log("Verificando sessão inicial no useAuthSession...");
    
    // Primeiro, configurar o listener de eventos de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, !!currentSession);
      
      // Atualizar o estado local com a sessão e usuário
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Tratar eventos específicos de autenticação
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        handleAuthRedirect(event, currentSession);
      }
    });

    // Depois, verificar se há uma sessão ativa
    const checkSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        console.log("Sessão inicial:", !!initialSession);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        // Redirecionamentos baseados na sessão inicial
        if (initialSession && location.pathname === '/auth') {
          navigate('/dashboard', { replace: true });
        } else if (!initialSession && !isPublicRoute(location.pathname)) {
          navigate('/auth', { 
            replace: true,
            state: { from: location }
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [handleAuthRedirect, navigate, location]);

  return { session, user, loading, setSession, setUser };
};
