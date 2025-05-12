
import { User } from '@supabase/supabase-js';
import { AuthUser } from './types';

// Function to convert User to AuthUser (guaranteeing email)
export const convertToAuthUser = (user: User | null): AuthUser | null => {
  if (!user || !user.email) return null;
  
  // Create AuthUser with all User properties plus additional ones
  const authUser: AuthUser = {
    ...user,
    email: user.email
  };
  
  return authUser;
};
