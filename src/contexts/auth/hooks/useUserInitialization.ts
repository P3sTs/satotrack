
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
        // Não falhar o processo se a geração de carteiras falhar
        return null;
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
      
      // First initialize basic user data - this should never fail registration
      try {
        await initializeUserData(userId);
      } catch (dataError) {
        console.warn('Erro na inicialização de dados básicos, mas continuando:', dataError);
      }
      
      // Then try to generate crypto wallets - this is optional and should not block registration
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await generateCryptoWallets(userId, session);
        }
      } catch (walletError) {
        console.warn('Erro na geração de carteiras, mas usuário foi criado:', walletError);
      }
      
      console.log('Inicialização do usuário concluída (com ou sem carteiras)');
    } catch (error) {
      console.error('Erro na inicialização completa do usuário:', error);
      // Não falhar o processo de registro completamente - usuário já foi criado
    }
  }, []);

  return { initializeNewUser, generateCryptoWallets };
};
