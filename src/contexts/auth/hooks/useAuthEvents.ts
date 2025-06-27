
import { useCallback } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../../../integrations/supabase/client';

interface UseAuthEventsProps {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initializeNewUser: (userId: string) => Promise<void>;
}

export const useAuthEvents = ({
  setSession,
  setUser,
  setLoading,
  initializeNewUser
}: UseAuthEventsProps) => {
  const setupAuthStateListener = useCallback(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log("Auth state changed:", event, !!currentSession);
        
        if (currentSession) {
          console.log("Sessão ativa:", {
            hasAccessToken: !!currentSession.access_token,
            hasUser: !!currentSession.user,
            userEmail: currentSession.user?.email,
            expiresAt: currentSession.expires_at
          });
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Handle new user registration - check for SIGNED_UP event
        if (event === 'SIGNED_UP' && currentSession?.user) {
          console.log("Novo usuário registrado, inicializando dados...");
          setTimeout(async () => {
            try {
              await initializeNewUser(currentSession.user.id);
              console.log("Dados do usuário inicializados com sucesso");
            } catch (error) {
              console.error('Erro na inicialização completa do usuário:', error);
            }
          }, 1000);
        }
        
        if (event === 'SIGNED_IN' && currentSession) {
          console.log("Usuário logado com sucesso");
        }
        
        if (event === 'SIGNED_OUT') {
          console.log("Usuário deslogado");
        }
      }
    );

    return subscription;
  }, [setSession, setUser, setLoading, initializeNewUser]);

  return { setupAuthStateListener };
};
