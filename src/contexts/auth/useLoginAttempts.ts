
import { useState, useEffect } from 'react';
import { LoginAttempt } from './types';

// Limite de tentativas de login
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_COOLDOWN_PERIOD = 15 * 60 * 1000; // 15 minutos em ms

export const useLoginAttempts = () => {
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'danger'>('secure');

  // Carrega dados de localStorage ao iniciar
  useEffect(() => {
    try {
      const storedLoginAttempts = localStorage.getItem('loginAttempts');
      if (storedLoginAttempts) {
        setLoginAttempts(JSON.parse(storedLoginAttempts));
      }
    } catch (e) {
      console.error('Erro ao carregar dados do localStorage:', e);
    }
  }, []);

  // Verifica se há muitas tentativas de login falhas
  const checkFailedLoginAttempts = (email: string): boolean => {
    const now = Date.now();
    const recentAttempts = loginAttempts
      .filter(attempt => attempt.email === email && 
              !attempt.success && 
              (now - attempt.timestamp) < LOGIN_COOLDOWN_PERIOD);
    
    return recentAttempts.length >= MAX_LOGIN_ATTEMPTS;
  };
  
  // Retorna o número de tentativas falhas
  const getFailedLoginAttempts = (): number => {
    const now = Date.now();
    return loginAttempts
      .filter(attempt => !attempt.success && 
              (now - attempt.timestamp) < LOGIN_COOLDOWN_PERIOD).length;
  };
  
  // Reseta contador de tentativas
  const resetFailedLoginAttempts = () => {
    setLoginAttempts([]);
    localStorage.removeItem('loginAttempts');
  };

  // Salva tentativas no localStorage para persistência
  const saveLoginAttempt = (email: string, success: boolean) => {
    const attempt: LoginAttempt = { email, timestamp: Date.now(), success };
    const newAttempts = [...loginAttempts, attempt];
    setLoginAttempts(newAttempts);
    
    try {
      localStorage.setItem('loginAttempts', JSON.stringify(newAttempts));
    } catch (e) {
      console.error('Erro ao salvar tentativas de login:', e);
    }
  };

  // Efeito para atualizar status de segurança
  useEffect(() => {
    const failedCount = getFailedLoginAttempts();
    if (failedCount >= MAX_LOGIN_ATTEMPTS - 1) {
      setSecurityStatus('danger');
    } else if (failedCount >= MAX_LOGIN_ATTEMPTS / 2) {
      setSecurityStatus('warning');
    } else {
      setSecurityStatus('secure');
    }
  }, [loginAttempts]);

  return {
    loginAttempts,
    checkFailedLoginAttempts,
    getFailedLoginAttempts,
    resetFailedLoginAttempts,
    saveLoginAttempt,
    securityStatus
  };
};
