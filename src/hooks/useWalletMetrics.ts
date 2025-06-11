
import { useState, useEffect, useCallback } from 'react';
import { useCarteiras } from '@/contexts/carteiras';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, endOfMonth, differenceInDays } from 'date-fns';

interface WalletVariations {
  balance: number;
  inflow: number;
  outflow: number;
  inflowAmount: number;
  outflowAmount: number;
}

interface TransactionData {
  date: string;
  amount: number;
  type: 'entrada' | 'saida';
}

export const useWalletMetrics = (walletId: string, timeRange: '7d' | '30d' | '90d') => {
  const { carteiras, transacoes, carregarTransacoes } = useCarteiras();
  const [variations, setVariations] = useState<WalletVariations>({
    balance: 0,
    inflow: 0,
    outflow: 0,
    inflowAmount: 0,
    outflowAmount: 0
  });
  const [averageInflow, setAverageInflow] = useState(0);
  const [projectedBalance, setProjectedBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState<TransactionData[]>([]);

  // Função para carregar transações do supabase
  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);

      // Primeiro carregar do contexto
      if (!transacoes[walletId]) {
        await carregarTransacoes(walletId);
      }

      // Data de início com base no período
      const today = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = subDays(today, days);
      
      // Carregar histórico de transações diretamente do supabase para garantir dados completos
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', walletId)
        .gte('transaction_date', startDate.toISOString())
        .order('transaction_date', { ascending: true });

      if (error) throw error;

      const formattedData = (data || []).map(tx => ({
        date: format(new Date(tx.transaction_date), 'yyyy-MM-dd'),
        amount: Number(tx.amount),
        type: tx.transaction_type as 'entrada' | 'saida'
      }));

      setTransactionHistory(formattedData);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setIsLoading(false);
    }
  }, [walletId, timeRange, carregarTransacoes, transacoes]);

  // Calcular variações
  const calculateVariations = useCallback(() => {
    const wallet = carteiras.find(c => c.id === walletId);
    if (!wallet || transactionHistory.length === 0) return;

    const today = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = subDays(today, days);
    const previousStartDate = subDays(startDate, days);

    // Transações do período atual
    const currentPeriodTxs = transactionHistory;

    // Separar por tipo
    const currentInflows = currentPeriodTxs.filter(tx => tx.type === 'entrada');
    const currentOutflows = currentPeriodTxs.filter(tx => tx.type === 'saida');

    // Calcular totais do período atual
    const totalCurrentInflow = currentInflows.reduce((sum, tx) => sum + tx.amount, 0);
    const totalCurrentOutflow = currentOutflows.reduce((sum, tx) => sum + tx.amount, 0);

    // Consultar o banco para períodos anteriores
    const calculatePreviousPeriod = async () => {
      try {
        const { data: previousData, error } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('wallet_id', walletId)
          .gte('transaction_date', previousStartDate.toISOString())
          .lt('transaction_date', startDate.toISOString());

        if (error) throw error;

        // Separar por tipo
        const previousInflows = (previousData || [])
          .filter(tx => tx.transaction_type === 'entrada')
          .reduce((sum, tx) => sum + Number(tx.amount), 0);

        const previousOutflows = (previousData || [])
          .filter(tx => tx.transaction_type === 'saida')
          .reduce((sum, tx) => sum + Number(tx.amount), 0);

        // Calcular variações em percentagem
        const inflowVariation = previousInflows === 0 
          ? totalCurrentInflow > 0 ? 100 : 0 
          : ((totalCurrentInflow - previousInflows) / previousInflows) * 100;
          
        const outflowVariation = previousOutflows === 0 
          ? totalCurrentOutflow > 0 ? 100 : 0 
          : ((totalCurrentOutflow - previousOutflows) / previousOutflows) * 100;

        // Estimar variação de saldo com base nas transações recentes
        const netCurrentChange = totalCurrentInflow - totalCurrentOutflow;
        const netPreviousChange = previousInflows - previousOutflows;
        const balanceVariation = netPreviousChange === 0 
          ? netCurrentChange > 0 ? 100 : netCurrentChange < 0 ? -100 : 0
          : ((netCurrentChange - netPreviousChange) / Math.abs(netPreviousChange)) * 100;

        setVariations({
          balance: balanceVariation,
          inflow: inflowVariation,
          outflow: outflowVariation,
          inflowAmount: totalCurrentInflow,
          outflowAmount: totalCurrentOutflow
        });

        // Calcular média semanal
        const weeksInPeriod = days / 7;
        const weeklyAverage = totalCurrentInflow / weeksInPeriod;
        setAverageInflow(weeklyAverage);

        // Calcular projeção de saldo para o fim do mês
        const daysToEndMonth = differenceInDays(endOfMonth(today), today);
        const dailyRate = netCurrentChange / days;
        const projectedChange = dailyRate * daysToEndMonth;
        setProjectedBalance(wallet.saldo + projectedChange);
      } catch (error) {
        console.error('Erro ao calcular métricas:', error);
      }
    };

    calculatePreviousPeriod();
  }, [carteiras, walletId, transactionHistory, timeRange]);

  // Carregar e calcular dados ao inicializar
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions, timeRange]);

  // Calcular variações quando as transações mudarem
  useEffect(() => {
    if (transactionHistory.length > 0) {
      calculateVariations();
    }
  }, [transactionHistory, calculateVariations]);

  // Função para atualizar métricas
  const refreshMetrics = useCallback(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    variations,
    averageInflow,
    projectedBalance,
    isLoading,
    refreshMetrics,
    transactionHistory
  };
};
