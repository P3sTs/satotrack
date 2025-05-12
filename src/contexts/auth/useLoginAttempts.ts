
import { LoginAttempt } from './types';
import { useLoginStorage } from './login/useLoginStorage';
import { useLoginSecurity, LOGIN_COOLDOWN_PERIOD } from './login/useLoginSecurity';

export const useLoginAttempts = () => {
  const { loginAttempts, saveLoginAttempts, resetLoginAttempts } = useLoginStorage();
  const { securityStatus, checkFailedLoginAttempts, getFailedLoginAttempts } = useLoginSecurity(loginAttempts);
  
  // Save new login attempt
  const saveLoginAttempt = (email: string, success: boolean) => {
    const attempt: LoginAttempt = { email, timestamp: Date.now(), success };
    const newAttempts = [...loginAttempts, attempt];
    saveLoginAttempts(newAttempts);
  };

  // Correctly reference resetLoginAttempts from useLoginStorage
  const resetFailedLoginAttempts = () => {
    resetLoginAttempts();
  };

  return {
    loginAttempts,
    checkFailedLoginAttempts,
    getFailedLoginAttempts,
    resetFailedLoginAttempts,
    saveLoginAttempt,
    securityStatus
  };
};
