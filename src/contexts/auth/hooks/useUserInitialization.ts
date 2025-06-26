
import { useCallback } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { initializeUserData } from '../userInitialization';

export const useUserInitialization = () => {
  const generateCryptoWallets = async (userId: string, session: any) => {
    try {
      console.log('Iniciando geração automática de carteiras cripto para usuário:', userId);
      
      // Aguardar um pouco para garantir que o usuário foi processado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      // Não falhar o processo se a geração de carteiras falhar
      return null;
    }
  };

  const initializeNewUser = useCallback(async (userId: string) => {
    try {
      console.log('Iniciando inicialização completa do usuário:', userId);
      
      // First initialize basic user data
      await initializeUserData(userId);
      
      // Then generate crypto wallets automatically with retry logic
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            await generateCryptoWallets(userId, session);
            break; // Success, exit loop
          }
        } catch (walletError) {
          attempts++;
          console.warn(`Tentativa ${attempts} de gerar carteiras falhou:`, walletError);
          
          if (attempts >= maxAttempts) {
            console.error('Falha ao gerar carteiras após 3 tentativas');
          } else {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
          }
        }
      }
      
      console.log('Inicialização do usuário concluída');
    } catch (error) {
      console.error('Erro na inicialização completa do usuário:', error);
      // Não falhar o processo de registro completamente
    }
  }, []);

  return { initializeNewUser, generateCryptoWallets };
};
