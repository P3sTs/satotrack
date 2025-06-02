
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useWalletData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchWalletData = async (address: string): Promise<any> => {
    console.log('🔍 [useWalletData] Iniciando busca para endereço:', address);
    
    try {
      const response = await fetch('https://cwmzzdwoagtmxdmgtfzj.supabase.co/functions/v1/fetch-wallet-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bXp6ZHdvYWd0bXhkbWd0ZnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzMxNDksImV4cCI6MjA2MjIwOTE0OX0.qScbTmaTrg8OT5VHd4P92w83wXZGYEjX8YVDM4V-Hzs',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bXp6ZHdvYWd0bXhkbWd0ZnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzMxNDksImV4cCI6MjA2MjIwOTE0OX0.qScbTmaTrg8OT5VHd4P92w83wXZGYEjX8YVDM4V-Hzs'
        },
        body: JSON.stringify({
          address: address,
          wallet_id: null
        }),
        signal: AbortSignal.timeout(30000) // 30 segundo timeout
      });

      console.log('📡 [useWalletData] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [useWalletData] Erro na resposta da API:', response.status, errorText);
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ [useWalletData] Dados recebidos da API:', data);
      
      // Validação e formatação dos dados
      const walletData = {
        balance: Number(data.balance) || 0,
        total_received: Number(data.total_received) || 0,
        total_sent: Number(data.total_sent) || 0,
        transaction_count: Number(data.transaction_count) || 0,
        transactions: Array.isArray(data.transactions) ? data.transactions.slice(0, 10) : [] // Limitar a 10 transações
      };

      console.log('🔄 [useWalletData] Dados formatados:', walletData);
      return walletData;

    } catch (error) {
      console.error('💥 [useWalletData] Erro ao chamar a API:', error);
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
