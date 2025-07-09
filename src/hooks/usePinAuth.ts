import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecuritySettings {
  id: string;
  user_id: string;
  pin_hash: string | null;
  pin_salt: string | null;
  biometric_enabled: boolean;
  pin_enabled: boolean;
  security_setup_completed: boolean;
  failed_attempts: number;
  locked_until: string | null;
  last_successful_auth: string | null;
}

export const usePinAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Gerar hash do PIN usando Web Crypto API
  const hashPin = async (pin: string, salt?: string): Promise<{ hash: string; salt: string }> => {
    const actualSalt = salt || crypto.getRandomValues(new Uint8Array(16)).toString();
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + actualSalt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return { hash, salt: actualSalt };
  };

  // Buscar configurações de segurança do usuário
  const getSecuritySettings = async (): Promise<SecuritySettings | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching security settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting security settings:', error);
      return null;
    }
  };

  // Configurar PIN pela primeira vez
  const setupPin = async (pin: string): Promise<boolean> => {
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      toast.error('PIN deve ter exatamente 6 dígitos');
      return false;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      const { hash, salt } = await hashPin(pin);

      const { error } = await supabase
        .from('user_security_settings')
        .upsert({
          user_id: user.id,
          pin_hash: hash,
          pin_salt: salt,
          pin_enabled: true,
          security_setup_completed: true,
          failed_attempts: 0,
          locked_until: null,
          last_successful_auth: new Date().toISOString()
        });

      if (error) {
        console.error('Error setting up PIN:', error);
        toast.error('Erro ao configurar PIN');
        return false;
      }

      toast.success('✅ PIN configurado com sucesso!');
      return true;
    } catch (error) {
      console.error('Error in setupPin:', error);
      toast.error('Erro interno ao configurar PIN');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar PIN
  const verifyPin = async (pin: string): Promise<boolean> => {
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      toast.error('PIN deve ter 6 dígitos');
      return false;
    }

    setIsLoading(true);
    try {
      const settings = await getSecuritySettings();
      if (!settings || !settings.pin_enabled || !settings.pin_hash || !settings.pin_salt) {
        toast.error('PIN não configurado');
        return false;
      }

      // Verificar se está bloqueado
      if (settings.locked_until && new Date(settings.locked_until) > new Date()) {
        toast.error('Conta temporariamente bloqueada devido a tentativas incorretas');
        return false;
      }

      const { hash } = await hashPin(pin, settings.pin_salt);
      
      if (hash === settings.pin_hash) {
        // PIN correto - resetar tentativas e atualizar último acesso
        await supabase
          .from('user_security_settings')
          .update({
            failed_attempts: 0,
            locked_until: null,
            last_successful_auth: new Date().toISOString()
          })
          .eq('user_id', settings.user_id);

        return true;
      } else {
        // PIN incorreto - incrementar tentativas falhadas
        const newFailedAttempts = settings.failed_attempts + 1;
        let locked_until = null;

        // Bloquear após 5 tentativas por 5 minutos
        if (newFailedAttempts >= 5) {
          locked_until = new Date(Date.now() + 5 * 60 * 1000).toISOString();
          toast.error('Muitas tentativas incorretas. Conta bloqueada por 5 minutos.');
        } else {
          toast.error(`PIN incorreto. Tentativas restantes: ${5 - newFailedAttempts}`);
        }

        await supabase
          .from('user_security_settings')
          .update({
            failed_attempts: newFailedAttempts,
            locked_until
          })
          .eq('user_id', settings.user_id);

        return false;
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast.error('Erro ao verificar PIN');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar se PIN está configurado
  const isPinSetup = async (): Promise<boolean> => {
    try {
      const settings = await getSecuritySettings();
      return settings?.pin_enabled && settings?.security_setup_completed || false;
    } catch (error) {
      console.error('Error checking PIN setup:', error);
      return false;
    }
  };

  // Alterar PIN
  const changePin = async (currentPin: string, newPin: string): Promise<boolean> => {
    const isCurrentValid = await verifyPin(currentPin);
    if (!isCurrentValid) {
      toast.error('PIN atual incorreto');
      return false;
    }

    return await setupPin(newPin);
  };

  // Desabilitar PIN
  const disablePin = async (pin: string): Promise<boolean> => {
    const isValid = await verifyPin(pin);
    if (!isValid) {
      toast.error('PIN incorreto');
      return false;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_security_settings')
        .update({
          pin_enabled: false,
          pin_hash: null,
          pin_salt: null,
          security_setup_completed: false
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error disabling PIN:', error);
        return false;
      }

      toast.success('PIN desabilitado com sucesso');
      return true;
    } catch (error) {
      console.error('Error in disablePin:', error);
      return false;
    }
  };

  return {
    setupPin,
    verifyPin,
    isPinSetup,
    changePin,
    disablePin,
    getSecuritySettings,
    isLoading
  };
};