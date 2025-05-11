
import { PasswordStrengthResult } from './types';

// Function to verify password strength
export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  let score = 0;
  let feedback = '';
  
  // Comprimento mínimo
  if (password.length >= 8) score += 1;
  else feedback = 'Senha muito curta';
  
  // Caracteres especiais
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  // Letras maiúsculas
  if (/[A-Z]/.test(password)) score += 1;
  
  // Letras minúsculas
  if (/[a-z]/.test(password)) score += 1;
  
  // Números
  if (/[0-9]/.test(password)) score += 1;
  
  // Feedback baseado na pontuação
  if (score === 0) feedback = 'Senha muito fraca';
  else if (score <= 2) feedback = 'Senha fraca';
  else if (score <= 3) feedback = 'Senha média';
  else if (score === 4) feedback = 'Senha forte';
  else feedback = 'Senha muito forte';
  
  return { score, feedback };
};
