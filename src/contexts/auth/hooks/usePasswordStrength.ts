
import { useCallback } from 'react';

export const usePasswordStrength = () => {
  // Função para avaliar a força da senha com regras mais estritas
  const passwordStrength = useCallback((password: string) => {
    if (!password) {
      return { score: 0, feedback: 'Senha não pode estar vazia' };
    }

    let score = 0;
    let feedback = '';

    // Comprimento mínimo
    if (password.length >= 12) {
      score += 2;
    } else if (password.length >= 8) {
      score += 1;
    } else {
      score = 0;
      feedback = 'Senha muito curta';
      return { score, feedback };
    }

    // Verificar combinação de caracteres
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

    if (hasLowercase) score += 0.5;
    if (hasUppercase) score += 0.5;
    if (hasNumbers) score += 0.5;
    if (hasSpecialChars) score += 0.5;

    // Senhas comuns ou padrões
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome', 'senha'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score = Math.min(score, 1);
      feedback = 'Senha muito comum ou previsível';
    }

    // Avaliação final
    if (score < 1) {
      feedback = 'Senha muito fraca';
    } else if (score < 2) {
      feedback = 'Senha fraca';
    } else if (score < 3) {
      feedback = 'Senha razoável';
    } else if (score < 4) {
      feedback = 'Senha forte';
    } else {
      feedback = 'Senha muito forte';
    }

    return { score, feedback };
  }, []);

  return { passwordStrength };
};
