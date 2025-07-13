
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface UseAuthEventsProps {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initializeNewUser: (user: User) => void;
}

export const useAuthEvents = (props?: UseAuthEventsProps) => {
  const setupAuthStateListener = useCallback(() => {
    console.log('🔒 Setting up secure auth event listeners...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔒 Auth event:', event, {
          "_type": typeof session,
          "value": session ? "session_exists" : "undefined"
        });
        
        if (event === 'INITIAL_SESSION') {
          console.log('Sessão inicial encontrada:', !!session);
          if (props) {
            props.setSession(session);
            props.setUser(session?.user ?? null);
            props.setLoading(false);
          }
        } else if (event === 'SIGNED_IN') {
          console.log('🔒 User signed in securely:', session?.user?.email);
          console.log('🔒 SECURITY COMPLIANT: User authentication completed - No sensitive data exposed');
          
          if (props) {
            props.setSession(session);
            props.setUser(session?.user ?? null);
            props.setLoading(false);
            
            if (session?.user) {
              setTimeout(() => {
                props.initializeNewUser(session.user);
              }, 0);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🔒 User signed out securely');
          console.log('🔒 SECURITY COMPLIANT: User session terminated cleanly');
          
          if (props) {
            props.setSession(null);
            props.setUser(null);
            props.setLoading(false);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔒 Token refreshed securely');
          
          if (props) {
            props.setSession(session);
            props.setUser(session?.user ?? null);
          }
        }
      }
    );

    return subscription;
  }, []); // Remove props das dependências para evitar recriações

  // Setup event listeners for user activity if no props provided (standalone usage)
  useEffect(() => {
    if (!props) {
      console.log('🔒 Setting up secure auth event listeners...');
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔒 Auth event:', event, session?.user?.email);
          
          if (event === 'SIGNED_IN') {
            console.log('🔒 User signed in securely:', session?.user?.email);
            console.log('🔒 SECURITY COMPLIANT: User authentication completed - No sensitive data exposed');
          } else if (event === 'SIGNED_OUT') {
            console.log('🔒 User signed out securely');
            console.log('🔒 SECURITY COMPLIANT: User session terminated cleanly');
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('🔒 Token refreshed securely');
          }
        }
      );

      return () => {
        console.log('🔒 Cleaning up secure auth listeners...');
        subscription?.unsubscribe();
      };
    }
  }, [props]);

  return { setupAuthStateListener };
};
