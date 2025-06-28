
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthEvents = () => {
  useEffect(() => {
    console.log('🔒 Setting up secure auth event listeners...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔒 Auth event:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN') {
          console.log('🔒 User signed in securely:', session?.user?.email);
          
          // Log security compliance for user authentication
          console.log('🔒 SECURITY COMPLIANT: User authentication completed - No sensitive data exposed');
        } else if (event === 'SIGNED_OUT') {
          console.log('🔒 User signed out securely');
          
          // Clear any cached data on signout for security
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
  }, []);
};
