
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useWalletData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchWalletData = async (address: string): Promise<any> => {
    try {
      console.log('Iniciando busca para endereço:', address);
      
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
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', response.status, errorText);
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados recebidos da API:', data);
      
      // Garantir que os dados estão no formato correto
      return {
        balance: data.balance || 0,
        total_received: data.total_received || 0,
        total_sent: data.total_sent || 0,
        transaction_count: data.transaction_count || 0,
        transactions: Array.isArray(data.transactions) ? data.transactions : []
      };
    } catch (error) {
      console.error('Erro ao chamar a API fetch-wallet-data:', error);
      throw error;
    }
  };

  const validateAndFetchWallet = async (address: string) => {
    setIsLoading(true);
    
    try {
      if (!address || address.length < 26 || address.length > 35) {
        throw new Error('Formato de endereço Bitcoin inválido');
      }

      const walletData = await fetchWalletData(address);
      
      if (!walletData) {
        throw new Error('Nenhum dado retornado para esta carteira');
      }

      toast({
        title: "✅ Carteira adicionada com sucesso!",
        description: `${address.substring(0, 8)}...${address.substring(address.length - 8)} • ${walletData.balance || 0} BTC`,
      });

      return walletData;

    } catch (error: any) {
      console.error('Erro completo:', error);
      
      toast({
        title: "❌ Erro ao buscar dados da carteira",
        description: error.message || 'Verifique se o endereço está correto e tente novamente',
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    validateAndFetchWallet
  };
};
