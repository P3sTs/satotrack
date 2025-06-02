
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useWalletData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchWalletData = async (address: string): Promise<any> => {
    console.log('🔍 [useWalletData] Iniciando busca para endereço:', address);
    
    try {
      // Usar o método invoke do Supabase para chamar a função de borda
      const { data, error } = await supabase.functions.invoke('fetch-wallet-data', {
        body: {
          address: address,
          wallet_id: null
        }
      });

      console.log('📡 [useWalletData] Response da função de borda:', { data, error });

      if (error) {
        console.error('❌ [useWalletData] Erro na função de borda:', error);
        throw new Error(`Erro na API: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nenhum dado retornado para esta carteira');
      }

      console.log('✅ [useWalletData] Dados recebidos da função de borda:', data);
      
      // Validação e formatação dos dados
      const walletData = {
        balance: Number(data.balance) || 0,
        total_received: Number(data.total_received) || 0,
        total_sent: Number(data.total_sent) || 0,
        transaction_count: Number(data.transaction_count) || 0,
        transactions: Array.isArray(data.transactions) ? data.transactions.slice(0, 10) : []
      };

      console.log('🔄 [useWalletData] Dados formatados:', walletData);
      return walletData;

    } catch (error) {
      console.error('💥 [useWalletData] Erro ao chamar a função de borda:', error);
      throw error;
    }
  };

  const validateAndFetchWallet = async (address: string) => {
    console.log('🚀 [useWalletData] Iniciando validação e busca:', address);
    
    if (isLoading) {
      console.warn('⚠️ [useWalletData] Já está carregando, ignorando nova requisição');
      return;
    }

    setIsLoading(true);
    
    try {
      // Validação básica
      if (!address || typeof address !== 'string' || address.length < 26 || address.length > 35) {
        throw new Error('Formato de endereço Bitcoin inválido');
      }

      console.log('✅ [useWalletData] Endereço validado, buscando dados...');
      const walletData = await fetchWalletData(address.trim());
      
      if (!walletData) {
        throw new Error('Nenhum dado retornado para esta carteira');
      }

      toast({
        title: "✅ Carteira adicionada com sucesso!",
        description: `${address.substring(0, 8)}...${address.substring(address.length - 8)} • ${walletData.balance || 0} BTC`,
      });

      console.log('🎉 [useWalletData] Busca concluída com sucesso');
      return walletData;

    } catch (error: any) {
      console.error('❌ [useWalletData] Erro completo:', error);
      
      toast({
        title: "❌ Erro ao buscar dados da carteira",
        description: error.message || 'Verifique se o endereço está correto e tente novamente',
        variant: "destructive"
      });
      
      throw error;
    } finally {
      console.log('🏁 [useWalletData] Finalizando loading state');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    validateAndFetchWallet
  };
};
