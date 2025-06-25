
import { useCallback } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { initializeUserData } from '../userInitialization';

export const useUserInitialization = () => {
  const generateCryptoWallets = async (userId: string, session: any) => {
    try {
      console.log('Iniciando geração automática de carteiras cripto para usuário:', userId);
      
      const { data, error } = await supabase.functions.invoke('generate-crypto-wallets', {
        body: { userId },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        console.error('Erro ao gerar carteiras cripto:', error);
        throw error;
      }

      console.log('Carteiras cripto geradas com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro na geração de carteiras:', error);
      throw error;
    }
  };

  const initializeNewUser = useCallback(async (userId: string) => {
    try {
      // First initialize basic user data
      await initializeUserData(userId);
      
      // Then generate crypto wallets automatically
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await generateCryptoWallets(userId, session);
      }
    } catch (error) {
      console.error('Erro na inicialização completa do usuário:', error);
      throw error;
    }
  }, []);

  return { initializeNewUser, generateCryptoWallets };
};
