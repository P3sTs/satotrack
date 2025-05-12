
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle redirects when auth state changes
        if (event === 'SIGNED_IN') {
          // Redirect to dashboard on sign in, unless there's a specific redirect path
          const redirectTo = location.state?.from?.pathname || '/dashboard';
          navigate(redirectTo, { replace: true });
        } else if (event === 'SIGNED_OUT') {
          // On sign out, redirect to auth page
          navigate('/auth', { replace: true });
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Handle redirects based on current path if needed
      if (session && location.pathname === '/auth') {
        navigate('/dashboard', { replace: true });
      } else if (!session && location.pathname !== '/' && 
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
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return { session, user, loading, setSession, setUser };
};
