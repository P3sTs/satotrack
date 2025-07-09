import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { toast } from 'sonner';

interface PinAuthResult {
  isPinSet: boolean;
  setupPin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  removePin: () => Promise<void>;
  checkPinStatus: () => Promise<boolean>;
}

export const usePinAuth = (): PinAuthResult => {
  const [isPinSet, setIsPinSet] = useState(false);

  // Hash simples para o PIN (em produção usar algo mais seguro)
  const hashPin = async (pin: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + 'satotracker_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const setupPin = async (pin: string): Promise<boolean> => {
    try {
      if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
        toast.error('PIN deve ter exatamente 6 dígitos');
        return false;
      }

      console.log('🔢 Configurando PIN de segurança...');
      const hashedPin = await hashPin(pin);
      
      await Preferences.set({ key: 'security_pin_hash', value: hashedPin });
      await Preferences.set({ key: 'pin_enabled', value: 'true' });
      await Preferences.set({ key: 'pin_created_at', value: Date.now().toString() });
      
      setIsPinSet(true);
      console.log('✅ PIN configurado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao configurar PIN:', error);
      return false;
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
        return false;
      }

      const storedHash = await Preferences.get({ key: 'security_pin_hash' });
      if (!storedHash.value) {
        return false;
      }

      const inputHash = await hashPin(pin);
      const isValid = inputHash === storedHash.value;
      
      console.log('🔢 Verificação de PIN:', isValid ? 'sucesso' : 'falhou');
      return isValid;
    } catch (error) {
      console.error('❌ Erro ao verificar PIN:', error);
      return false;
    }
  };

  const removePin = async (): Promise<void> => {
    try {
      await Preferences.remove({ key: 'security_pin_hash' });
      await Preferences.remove({ key: 'pin_enabled' });
      await Preferences.remove({ key: 'pin_created_at' });
      setIsPinSet(false);
      console.log('🗑️ PIN removido com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover PIN:', error);
    }
  };

  const checkPinStatus = async (): Promise<boolean> => {
    try {
      const pinEnabled = await Preferences.get({ key: 'pin_enabled' });
      const isSet = pinEnabled.value === 'true';
      setIsPinSet(isSet);
      return isSet;
    } catch (error) {
      console.error('❌ Erro ao verificar status do PIN:', error);
      return false;
    }
  };

  return {
    isPinSet,
    setupPin,
    verifyPin,
    removePin,
    checkPinStatus
  };
};