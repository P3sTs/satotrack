import { useState, useEffect } from 'react';
import { CarteiraBTC } from '@/types/types';
import { TimeRange } from '@/components/charts/selectors/TimeRangeSelector';

export interface BalanceDataPoint {
  timestamp: number;
  balance: number;
}

export interface TransactionDataPoint {
  timestamp: number;
  amount: number;
  type: 'sent' | 'received';
}

export function useBalanceChartData(wallet: CarteiraBTC | undefined, timeRange: TimeRange) {
  const [balanceData, setBalanceData] = useState<BalanceDataPoint[]>([]);
  const [transactionData, setTransactionData] = useState<TransactionDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateData = async () => {
      setIsLoading(true);
      
      try {
        // Calculate date range based on timeRange
        let timeInDays: number;
        switch (timeRange) {
          case '24H':
            timeInDays = 1;
            break;
          case '7D':
            timeInDays = 7;
            break;
          case '30D':
            timeInDays = 30;
            break;
          case '90D':
            timeInDays = 90;
            break;
          case '6M':
            timeInDays = 180;
            break;
          case '1Y':
            timeInDays = 365;
            break;
          default:
            timeInDays = 7;
        }
        
        // Calculate start and end dates
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - timeInDays * 24 * 60 * 60 * 1000);

        // Generate balance data
        const initialBalance = wallet?.saldo || 0;
        let currentBalance = initialBalance;
        const balanceData: BalanceDataPoint[] = [];

        // Generate transaction data
        const transactionData: TransactionDataPoint[] = [];

        // Define the number of data points based on the time range
        let numberOfDataPoints = 10;
        if (timeRange === '24H') numberOfDataPoints = 24;
        if (timeRange === '7D') numberOfDataPoints = 7;
        if (timeRange === '30D') numberOfDataPoints = 30;
        if (timeRange === '90D') numberOfDataPoints = 30;
        if (timeRange === '6M') numberOfDataPoints = 26;
        if (timeRange === '1Y') numberOfDataPoints = 52;

        const interval = (endDate.getTime() - startDate.getTime()) / numberOfDataPoints;

        for (let i = 0; i < numberOfDataPoints; i++) {
          const timestamp = startDate.getTime() + i * interval;

          // Simulate transactions (replace with actual transaction data)
          if (i % 3 === 0) {
            const amount = Math.random() * 0.001;
            const type = Math.random() > 0.5 ? 'sent' : 'received';

            if (type === 'sent') {
              currentBalance -= amount;
            } else {
              currentBalance += amount;
            }

            transactionData.push({
              timestamp,
              amount,
              type,
            });
          }

          balanceData.push({
            timestamp,
            balance: currentBalance,
          });
        }

        setBalanceData(balanceData);
        setTransactionData(transactionData);
      } catch (error) {
        console.error("Error generating chart data:", error);
      }
      
      setIsLoading(false);
    };

    generateData();
  }, [wallet, timeRange]);

  return { balanceData, transactionData, isLoading };
}
