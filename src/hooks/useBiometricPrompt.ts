import { useState, useEffect } from 'react';
import { useBiometric } from '@/contexts/BiometricContext';
import { Preferences } from '@capacitor/preferences';

interface UseBiometricPromptResult {
  shouldShowPrompt: boolean;
  showPrompt: (dataType?: string) => void;
  hidePrompt: () => void;
  dataType: string;
  checkAndPrompt: (dataType?: string) => Promise<boolean>;
}

export const useBiometricPrompt = (): UseBiometricPromptResult => {
  const { isBiometricEnabled, isBiometricAvailable } = useBiometric();
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [dataType, setDataType] = useState('dados sensíveis');

  const showPrompt = (type: string = 'dados sensíveis') => {
    setDataType(type);
    setShouldShowPrompt(true);
  };

  const hidePrompt = () => {
    setShouldShowPrompt(false);
  };

  const checkAndPrompt = async (type: string = 'dados sensíveis'): Promise<boolean> => {
    // Se biometria já está ativada, permitir acesso
    if (isBiometricEnabled) {
      return true;
    }

    // Se biometria não está disponível, permitir acesso
    if (!isBiometricAvailable) {
      return true;
    }

    // Verificar se o usuário desabilitou o prompt permanentemente
    const isDisabled = await Preferences.get({ key: 'biometric_prompt_disabled' });
    if (isDisabled.value === 'true') {
      return true;
    }

    // Verificar se o usuário pulou recentemente (nas últimas 24 horas)
    const lastSkipped = await Preferences.get({ key: 'biometric_prompt_skipped' });
    if (lastSkipped.value) {
      const skippedTime = parseInt(lastSkipped.value);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (now - skippedTime < twentyFourHours) {
        return true; // Não mostrar por 24h após pular
      }
    }

    // Mostrar o prompt
    showPrompt(type);
    return false; // Bloquear acesso até o usuário decidir
  };

  return {
    shouldShowPrompt,
    showPrompt,
    hidePrompt,
    dataType,
    checkAndPrompt
  };
};