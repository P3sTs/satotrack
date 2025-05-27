
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar a sessão inicial ao montar o componente
  useEffect(() => {
    console.log("Verificando sessão inicial no useAuthSession...");
    
    // Primeiro, configurar o listener de eventos de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, !!currentSession);
      
      // Atualizar o estado local com a sessão e usuário
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // Depois, verificar se há uma sessão ativa
    const checkSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        console.log("Sessão inicial:", !!initialSession);
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
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, setSession, setUser };
};
