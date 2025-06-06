
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useWalletData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchWalletData = async (address: string): Promise<any> => {
    console.log('🔍 [useWalletData] Iniciando busca aprimorada para endereço:', address);
    
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

      console.log('✅ [useWalletData] Dados completos recebidos:', data);
      
      // Validação e formatação dos dados com todos os campos disponíveis
      const walletData = {
        balance: Number(data.balance) || 0,
        total_received: Number(data.total_received) || 0,
        total_sent: Number(data.total_sent) || 0,
        transaction_count: Number(data.transaction_count) || 0,
        unconfirmed_balance: Number(data.unconfirmed_balance) || 0,
        transactions: Array.isArray(data.transactions) ? data.transactions.map((tx: any) => ({
          hash: tx.hash,
          amount: Number(tx.amount) || 0,
          transaction_type: tx.transaction_type,
          transaction_date: tx.transaction_date,
          confirmations: Number(tx.confirmations) || 0,
          fee: Number(tx.fee) || 0,
          block_height: tx.block_height || null,
          size: tx.size || 0,
          weight: tx.weight || 0
        })) : []
      };

      console.log('🔄 [useWalletData] Dados formatados com transações completas:', walletData);
      console.log(`📊 [useWalletData] Total de transações processadas: ${walletData.transactions.length}`);
      
      // Log das transações por tipo
      const entradas = walletData.transactions.filter(tx => tx.transaction_type === 'entrada');
      const saidas = walletData.transactions.filter(tx => tx.transaction_type === 'saida');
      
      console.log(`💰 [useWalletData] Transações de entrada: ${entradas.length}`);
      console.log(`💸 [useWalletData] Transações de saída: ${saidas.length}`);
      
      return walletData;

    } catch (error) {
      console.error('💥 [useWalletData] Erro ao chamar a função de borda:', error);
      throw error;
    }
  };

  const validateAndFetchWallet = async (address: string) => {
    console.log('🚀 [useWalletData] Iniciando validação e busca aprimorada:', address);
    
    if (isLoading) {
      console.warn('⚠️ [useWalletData] Já está carregando, ignorando nova requisição');
      return;
    }

    setIsLoading(true);
    
    try {
      // Validação básica mais flexível
      if (!address || typeof address !== 'string' || address.trim().length < 20) {
        throw new Error('Formato de endereço inválido');
      }

      console.log('✅ [useWalletData] Endereço validado, buscando dados completos...');
      const walletData = await fetchWalletData(address.trim());
      
      if (!walletData) {
        throw new Error('Nenhum dado retornado para esta carteira');
      }

      const transactionSummary = walletData.transactions.length > 0 ? 
        ` • ${walletData.transactions.length} transações encontradas` : 
        ' • Nenhuma transação encontrada';

      toast({
        title: "✅ Carteira adicionada com sucesso!",
        description: `${address.substring(0, 8)}...${address.substring(address.length - 8)} • ${walletData.balance || 0} BTC${transactionSummary}`,
      });

      console.log('🎉 [useWalletData] Busca completa concluída com sucesso');
      console.log(`📈 [useWalletData] Resumo: Balance: ${walletData.balance}, Received: ${walletData.total_received}, Sent: ${walletData.total_sent}, TXs: ${walletData.transaction_count}`);
      
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
