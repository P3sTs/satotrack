import { useState, useEffect, useCallback } from 'react';
import { useMultiChainWallets } from './useMultiChainWallets';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

export interface PerformanceData {
  totalValue: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  yearlyChange: number;
  bestPerformer: string;
  worstPerformer: string;
  averageHolding: number;
}

export interface PortfolioBreakdown {
  symbol: string;
  percentage: number;
  value: number;
  change: number;
}

export interface PerformanceHistory {
  date: string;
  value: number;
  change: number;
}

export const usePerformanceData = () => {
  const { user } = useAuth();
  const { wallets } = useMultiChainWallets();
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    totalValue: 0,
    dailyChange: 0,
    weeklyChange: 0,
    monthlyChange: 0,
    yearlyChange: 0,
    bestPerformer: 'BTC',
    worstPerformer: 'ETH',
    averageHolding: 0
  });
  const [portfolioBreakdown, setPortfolioBreakdown] = useState<PortfolioBreakdown[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Preços simulados das crypto (em produção, usar API real)
  const cryptoPrices = {
    BTC: 280000, // BRL
    ETH: 18500,
    MATIC: 4.2,
    USDT: 5.1,
    SOL: 580,
    AVAX: 220,
    BSC: 1800
  };

  const loadPerformanceData = useCallback(async () => {
    if (!user || wallets.length === 0) return;

    setIsLoading(true);
    try {
      // Calcular valor total do portfólio
      let totalValue = 0;
      const breakdown: PortfolioBreakdown[] = [];

      wallets.forEach(wallet => {
        const balance = parseFloat(wallet.balance || '0');
        const price = cryptoPrices[wallet.currency as keyof typeof cryptoPrices] || 1;
        const value = balance * price;
        totalValue += value;

        if (value > 0) {
          breakdown.push({
            symbol: wallet.currency,
            percentage: 0, // Será calculado depois
            value,
            change: Math.random() * 10 - 5 // Simulado
          });
        }
      });

      // Calcular percentuais
      breakdown.forEach(item => {
        item.percentage = (item.value / totalValue) * 100;
      });

      // Buscar snapshots históricos para calcular variações
      const { data: snapshots } = await supabase
        .from('portfolio_snapshots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      let dailyChange = 2.3;
      let weeklyChange = -1.2;
      let monthlyChange = 8.7;

      if (snapshots && snapshots.length > 1) {
        const latest = snapshots[0];
        const yesterday = snapshots.find(s => {
          const date = new Date(s.created_at);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return date.toDateString() === yesterday.toDateString();
        });

        if (yesterday) {
          const latestValue = typeof latest.total_value_usdt === 'string' ? parseFloat(latest.total_value_usdt) : latest.total_value_usdt;
          const yesterdayValue = typeof yesterday.total_value_usdt === 'string' ? parseFloat(yesterday.total_value_usdt) : yesterday.total_value_usdt;
          dailyChange = ((latestValue - yesterdayValue) / yesterdayValue) * 100;
        }
      }

      // Gerar histórico simulado
      const history: PerformanceHistory[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        history.push({
          date: date.toISOString().split('T')[0],
          value: totalValue * (0.95 + Math.random() * 0.1),
          change: Math.random() * 6 - 3
        });
      }

      setPerformanceData({
        totalValue,
        dailyChange,
        weeklyChange,
        monthlyChange,
        yearlyChange: 34.5,
        bestPerformer: breakdown.sort((a, b) => b.change - a.change)[0]?.symbol || 'BTC',
        worstPerformer: breakdown.sort((a, b) => a.change - b.change)[0]?.symbol || 'ETH',
        averageHolding: 145
      });

      setPortfolioBreakdown(breakdown.sort((a, b) => b.percentage - a.percentage));
      setPerformanceHistory(history);

    } catch (error) {
      console.error('Erro ao carregar dados de performance:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, wallets]);

  const savePortfolioSnapshot = useCallback(async () => {
    if (!user || wallets.length === 0) return;

    try {
      const totalValue = wallets.reduce((sum, wallet) => {
        const balance = parseFloat(wallet.balance || '0');
        const price = cryptoPrices[wallet.currency as keyof typeof cryptoPrices] || 1;
        return sum + (balance * price);
      }, 0);

      await supabase
        .from('portfolio_snapshots')
        .insert({
          user_id: user.id,
          total_value_usdt: totalValue / 5.1, // Converter BRL para USD aproximado
          snapshot_data: {
            wallets: wallets.map(w => ({
              currency: w.currency,
              balance: w.balance,
              address: w.address
            })),
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Erro ao salvar snapshot do portfólio:', error);
    }
  }, [user, wallets]);

  useEffect(() => {
    loadPerformanceData();
  }, [loadPerformanceData]);

  // Salvar snapshot diariamente
  useEffect(() => {
    const interval = setInterval(savePortfolioSnapshot, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [savePortfolioSnapshot]);

  return {
    performanceData,
    portfolioBreakdown,
    performanceHistory,
    isLoading,
    loadPerformanceData,
    savePortfolioSnapshot
  };
};