
import { LoginAttempt } from './types';
import { useLoginStorage } from './login/useLoginStorage';
import { useLoginSecurity } from './login/useLoginSecurity';

export const useLoginAttempts = () => {
  const { loginAttempts, saveLoginAttempts, resetLoginAttempts } = useLoginStorage();
  const { securityStatus, checkFailedLoginAttempts, getFailedLoginAttempts } = useLoginSecurity(loginAttempts);
  
  // Save new login attempt
  const saveLoginAttempt = (email: string, success: boolean) => {
    const attempt: LoginAttempt = { email, timestamp: Date.now(), success };
    const newAttempts = [...loginAttempts, attempt];
    saveLoginAttempts(newAttempts);
  };

  // Reset failed login attempts
  const resetFailedLoginAttempts = () => {
    resetLoginAttempts();
  };

  return {
    loginAttempts,
    securityStatus,
    checkFailedLoginAttempts,
    getFailedLoginAttempts,
    resetFailedLoginAttempts,
    saveLoginAttempt
  };
};
