
import { useState, useEffect } from 'react';
import { CarteiraBTC, TransacaoBTC } from '@/types/types';
import { loadTransacoes } from '@/services/carteiras/transacoesService';

export interface BalanceDataPoint {
  timestamp: number;
  balance: number;
}

export interface TransactionDataPoint {
  timestamp: number;
  valor: number;
  tipo: 'entrada' | 'saida';
}

type TimeRange = '7D' | '30D' | '6M' | '1Y';

export function useBalanceChartData(wallet: CarteiraBTC | undefined, timeRange: TimeRange) {
  const [balanceData, setBalanceData] = useState<BalanceDataPoint[]>([]);
  const [transactionData, setTransactionData] = useState<TransactionDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!wallet) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Determine time range in milliseconds
        let timeInDays;
        switch (timeRange) {
          case '7D':
            timeInDays = 7;
            break;
          case '30D':
            timeInDays = 30;
            break;
          case '6M':
            timeInDays = 180; // Approximately 6 months
            break;
          case '1Y':
            timeInDays = 365; // 1 year
            break;
          default:
            timeInDays = 7;
        }

        // Calculate start date
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - timeInDays * 24 * 60 * 60 * 1000);
        
        // Load actual transactions from the wallet
        const transactions = await loadTransacoes(wallet.id);
        
        // Filter transactions by time range
        const filteredTransactions = transactions.filter(tx => {
          const txDate = new Date(tx.data);
          return txDate >= startDate && txDate <= endDate;
        });
        
        // Transform transactions for chart
        const txDataPoints: TransactionDataPoint[] = filteredTransactions.map(tx => ({
          timestamp: new Date(tx.data).getTime(),
          valor: tx.valor,
          tipo: tx.tipo
        }));
        
        setTransactionData(txDataPoints);
        
        // Generate balance chart data
        const balanceDataPoints: BalanceDataPoint[] = [];
        
        // Start with current balance and work backwards
        let currentDate = new Date(endDate);
        let currentBalance = wallet.saldo;
        
        // Generate data points with appropriate interval based on time range
        let interval;
        let points;
        
        if (timeRange === '7D') {
          interval = 3 * 60 * 60 * 1000; // 3 hours
          points = 7 * 8; // 7 days * 8 points per day
        } else if (timeRange === '30D') {
          interval = 24 * 60 * 60 * 1000; // 1 day
          points = 30; // 30 days
        } else if (timeRange === '6M') {
          interval = 7 * 24 * 60 * 60 * 1000; // 1 week
          points = 26; // ~26 weeks in 6 months
        } else { // 1Y
          interval = 14 * 24 * 60 * 60 * 1000; // 2 weeks
          points = 26; // 26 biweekly points in a year
        }
        
        // Add the current balance point
        balanceDataPoints.push({
          timestamp: currentDate.getTime(),
          balance: currentBalance
        });
        
        // Generate historical points
        for (let i = 1; i < points; i++) {
          currentDate = new Date(endDate.getTime() - i * interval);
          const timestamp = currentDate.getTime();
          
          // Find transactions that occurred between this point and the previous
          const previousTimestamp = currentDate.getTime() + interval;
          const relevantTxs = filteredTransactions.filter(tx => {
            const txTime = new Date(tx.data).getTime();
            return txTime > timestamp && txTime <= previousTimestamp;
          });
          
          // Adjust balance by reversing transactions
          let balanceAdjustment = 0;
          relevantTxs.forEach(tx => {
            if (tx.tipo === 'entrada') {
              balanceAdjustment -= tx.valor; // Subtract received amounts
            } else {
              balanceAdjustment += tx.valor; // Add sent amounts
            }
          });
          
          // Calculate historical balance
          currentBalance += balanceAdjustment;
          
          balanceDataPoints.push({
            timestamp,
            balance: Math.max(0, currentBalance) // Ensure no negative balance
          });
        }
        
        // Sort by timestamp ascending for the chart
        balanceDataPoints.sort((a, b) => a.timestamp - b.timestamp);
        
        setBalanceData(balanceDataPoints);
      } catch (error) {
        console.error("Erro ao carregar dados da carteira:", error);
      }
      setIsLoading(false);
    };

    fetchWalletData();
  }, [timeRange, wallet]);

  return { balanceData, transactionData, isLoading };
}
