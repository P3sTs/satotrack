
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if user is authenticated
 * @returns Promise resolving to a boolean indicating authentication status
 */
export const checkAuthentication = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};

/**
 * Set up authentication state listener
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const setupAuthListener = (
  callback: (isAuthenticated: boolean) => void
): { unsubscribe: () => void } => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(!!session?.user);
  });
  
  return subscription;
};

