
import { DetectedAddress } from '@/services/crypto/addressDetector';

/**
 * Security utility functions for input validation and sanitization
 */

// XSS Protection - Sanitize user inputs
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};

// Email validation with security checks
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const sanitized = sanitizeInput(email);
  
  if (!sanitized) {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  if (sanitized.length > 254) {
    return { isValid: false, error: 'Email muito longo' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  return { isValid: true };
};

// Password strength validation (server-side)
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Senha é obrigatória' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Senha deve ter pelo menos 8 caracteres' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Senha muito longa' };
  }
  
  // Check for complexity
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const complexityCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (complexityCount < 3) {
    return { 
      isValid: false, 
      error: 'Senha deve conter pelo menos 3 dos seguintes: maiúscula, minúscula, número, caractere especial' 
    };
  }
  
  return { isValid: true };
};

// Crypto address validation
export const validateCryptoAddress = (address: string, expectedCurrency?: string): { isValid: boolean; error?: string } => {
  const sanitized = sanitizeInput(address);
  
  if (!sanitized) {
    return { isValid: false, error: 'Endereço é obrigatório' };
  }
  
  if (sanitized.length < 10 || sanitized.length > 100) {
    return { isValid: false, error: 'Endereço com formato inválido' };
  }
  
  // Basic format validation
  const addressRegex = /^[a-zA-Z0-9]+$/;
  if (!addressRegex.test(sanitized)) {
    return { isValid: false, error: 'Endereço contém caracteres inválidos' };
  }
  
  return { isValid: true };
};

// Amount validation for crypto transactions
export const validateTransactionAmount = (amount: string | number, currency: string): { isValid: boolean; error?: string } => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return { isValid: false, error: 'Valor deve ser maior que zero' };
  }
  
  // Set minimum amounts by currency (in base units)
  const minimums: Record<string, number> = {
    'BTC': 0.00001, // 1000 satoshis
    'ETH': 0.001,   // 0.001 ETH
    'MATIC': 0.01,  // 0.01 MATIC
    'USDT': 1,      // 1 USDT
    'SOL': 0.001    // 0.001 SOL
  };
  
  const minAmount = minimums[currency.toUpperCase()] || 0.0001;
  
  if (numAmount < minAmount) {
    return { 
      isValid: false, 
      error: `Valor mínimo para ${currency} é ${minAmount}` 
    };
  }
  
  // Maximum reasonable amount (prevent fat finger errors)
  if (numAmount > 1000000) {
    return { isValid: false, error: 'Valor muito alto, verifique o montante' };
  }
  
  return { isValid: true };
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier);
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (userRequests.count >= maxRequests) {
      return false;
    }
    
    userRequests.count++;
    return true;
  };
};
