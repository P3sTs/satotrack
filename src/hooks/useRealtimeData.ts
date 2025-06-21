
import { useState, useEffect } from 'react';
import { useBitcoinPrice } from './useBitcoinPrice';
import { useCarteiras } from '@/contexts/carteiras';

export interface RealtimeChartData {
  timestamp: string;
  price: number;
  volume?: number;
  change?: number;
}

export interface WalletPerformanceData {
  timestamp: string;
  totalBalance: number;
  totalValue: number;
  profitLoss: number;
}

export type ValueChangeState = 'positive' | 'negative' | 'neutral';

export const useRealtimeData = () => {
  const { data: bitcoinData } = useBitcoinPrice();
  const { carteiras } = useCarteiras();
  const [chartData, setChartData] = useState<RealtimeChartData[]>([]);
  const [walletData, setWalletData] = useState<WalletPerformanceData[]>([]);

  // Atualizar dados do Bitcoin em tempo real
  useEffect(() => {
    if (bitcoinData) {
      const newDataPoint: RealtimeChartData = {
        timestamp: new Date().toISOString(),
        price: bitcoinData.price_brl,
        volume: bitcoinData.volume_24h || 0,
        change: bitcoinData.price_change_24h || 0
      };

      setChartData(prev => {
        const updated = [...prev, newDataPoint].slice(-50); // Manter apenas últimos 50 pontos
        return updated;
      });
    }
  }, [bitcoinData]);

  // Atualizar dados das carteiras
  useEffect(() => {
    if (carteiras.length > 0 && bitcoinData) {
      const totalBalance = carteiras.reduce((acc, carteira) => acc + carteira.saldo, 0);
      const totalValue = totalBalance * bitcoinData.price_brl;
      const avgPrice = 50000; // Preço médio estimado para cálculo de P&L
      const profitLoss = totalValue - (totalBalance * avgPrice);

      const newWalletPoint: WalletPerformanceData = {
        timestamp: new Date().toISOString(),
        totalBalance,
        totalValue,
        profitLoss
      };

      setWalletData(prev => {
        const updated = [...prev, newWalletPoint].slice(-30); // Manter últimos 30 pontos
        return updated;
      });
    }
  }, [carteiras, bitcoinData]);

  // Gerar dados históricos simulados se não houver dados suficientes
  useEffect(() => {
    if (chartData.length === 0 && bitcoinData) {
      const historicalData: RealtimeChartData[] = [];
      const now = new Date();
      
      for (let i = 24; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const basePrice = bitcoinData.price_brl;
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variação
        const price = basePrice * (1 + variation);
        
        historicalData.push({
          timestamp: timestamp.toISOString(),
          price: price,
          volume: Math.random() * 1000000000,
          change: variation * 100
        });
      }
      
      setChartData(historicalData);
    }
  }, [bitcoinData]);

  return {
    chartData,
    walletData,
    isLoading: !bitcoinData,
    lastUpdate: new Date().toISOString()
  };
};

export const useRealtimeBitcoinPrice = () => {
  const { data: bitcoinData, loading, error } = useBitcoinPrice();
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  useEffect(() => {
    if (bitcoinData && previousPrice === null) {
      setPreviousPrice(bitcoinData.price_brl);
    } else if (bitcoinData && previousPrice !== bitcoinData.price_brl) {
      setPreviousPrice(bitcoinData.price_brl);
    }
  }, [bitcoinData, previousPrice]);

  return {
    data: bitcoinData,
    previousData: previousPrice ? { price_brl: previousPrice } : null,
    isLoading: loading,
    error,
    isRefreshing: false,
    refresh: () => {},
    lastUpdated: new Date()
  };
};

export const useValueChange = (currentValue: number, previousValue?: number): ValueChangeState => {
  if (!previousValue || currentValue === previousValue) return 'neutral';
  return currentValue > previousValue ? 'positive' : 'negative';
};
