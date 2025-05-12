
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser } from './types';
import { checkPasswordStrength } from './passwordUtils';
import { useAuthSession } from './useAuthSession';
import { useActivityMonitor } from './useActivityMonitor';
import { useLoginAttempts } from './useLoginAttempts';
import { convertToAuthUser } from './userUtils';
import { useAuthPlans } from './useAuthPlans';
import { useAuthFunctions } from './useAuthFunctions';

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component for the authentication context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the session hook to manage authentication state
  const { session, user: supabaseUser, loading, setSession } = useAuthSession();
  const [user, setUser] = useState<AuthUser | null>(convertToAuthUser(supabaseUser));

  // Initialize login attempts monitoring
  const { 
    loginAttempts, 
    checkFailedLoginAttempts, 
    getFailedLoginAttempts, 
    resetFailedLoginAttempts, 
    saveLoginAttempt,
    securityStatus: loginSecurityStatus 
  } = useLoginAttempts();

  // Activity monitoring for security
  const { 
    lastActivity, 
    updateLastActivity, 
    securityStatus: activitySecurityStatus,
    setLastActivity
  } = useActivityMonitor(user, async () => await authFunctions.signOut());

  // User plans and premium features
  const {
    userPlan,
    apiToken,
    apiRequestsRemaining,
    fetchUserPlan,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets
  } = useAuthPlans(user);

  // Authentication functions
  const authFunctions = useAuthFunctions(
    updateLastActivity,
    saveLoginAttempt,
    checkFailedLoginAttempts
  );

  // Update user state when supabaseUser changes
  useEffect(() => {
    const authUser = convertToAuthUser(supabaseUser);
    setUser(authUser);
    
    // Fetch user plan if user exists
    if (authUser?.id) {
      fetchUserPlan(authUser.id);
    }
  }, [supabaseUser]);

  // Combine security statuses from different sources
  const determineSecurityStatus = (): 'secure' | 'warning' | 'danger' => {
    if (loginSecurityStatus === 'danger' || activitySecurityStatus === 'danger') {
      return 'danger';
    } else if (loginSecurityStatus === 'warning' || activitySecurityStatus === 'warning') {
      return 'warning';
    } else {
      return 'secure';
    }
  };

  const securityStatus = determineSecurityStatus();

  // Combine all context values
  const contextValue: AuthContextType = {
    session,
    user,
    signIn: authFunctions.signIn,
    signUp: authFunctions.signUp,
    signOut: authFunctions.signOut,
    loading: authFunctions.loading,
    isAuthenticated: !!user,
    passwordStrength: checkPasswordStrength,
    lastActivity,
    updateLastActivity,
    securityStatus,
    failedLoginAttempts: getFailedLoginAttempts(),
    resetFailedLoginAttempts,
    upgradeUserPlan,
    userPlan,
    canAddMoreWallets,
    generateApiToken,
    apiToken,
    apiRequestsRemaining
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for use in other components
export { AuthContext };
