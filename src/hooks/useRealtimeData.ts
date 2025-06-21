
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

export type ValueChangeState = 'positive' | 'negative' | 'neutral' | 'initial' | 'increased' | 'decreased' | 'unchanged';

// Generic hook overload
export function useRealtimeData<T>(
  fetchFunction: () => Promise<T>,
  initialData: T,
  refreshInterval: number
): {
  data: T;
  previousData?: T;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => void;
  lastUpdated: Date;
};

// Default chart data overload
export function useRealtimeData(): {
  chartData: RealtimeChartData[];
  walletData: WalletPerformanceData[];
  isLoading: boolean;
  lastUpdate: string;
};

// Implementation
export function useRealtimeData<T>(
  fetchFunction?: () => Promise<T>,
  initialData?: T,
  refreshInterval?: number
) {
  const { data: bitcoinData } = useBitcoinPrice();
  const { carteiras } = useCarteiras();
  const [chartData, setChartData] = useState<RealtimeChartData[]>([]);
  const [walletData, setWalletData] = useState<WalletPerformanceData[]>([]);
  const [data, setData] = useState<T | null>(initialData || null);
  const [previousData, setPreviousData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Generic data fetching
  const fetchData = async () => {
    if (fetchFunction) {
      try {
        setIsRefreshing(true);
        const newData = await fetchFunction();
        setPreviousData(data);
        setData(newData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // Bitcoin data updates
  useEffect(() => {
    if (bitcoinData) {
      const newDataPoint: RealtimeChartData = {
        timestamp: new Date().toISOString(),
        price: bitcoinData.price_brl,
        volume: bitcoinData.volume_24h || 0,
        change: bitcoinData.price_change_24h || 0
      };

      setChartData(prev => {
        const updated = [...prev, newDataPoint].slice(-50);
        return updated;
      });
    }
  }, [bitcoinData]);

  // Wallet data updates
  useEffect(() => {
    if (carteiras.length > 0 && bitcoinData) {
      const totalBalance = carteiras.reduce((acc, carteira) => acc + carteira.saldo, 0);
      const totalValue = totalBalance * bitcoinData.price_brl;
      const avgPrice = 50000;
      const profitLoss = totalValue - (totalBalance * avgPrice);

      const newWalletPoint: WalletPerformanceData = {
        timestamp: new Date().toISOString(),
        totalBalance,
        totalValue,
        profitLoss
      };

      setWalletData(prev => {
        const updated = [...prev, newWalletPoint].slice(-30);
        return updated;
      });
    }
  }, [carteiras, bitcoinData]);

  // Generate historical data if needed
  useEffect(() => {
    if (chartData.length === 0 && bitcoinData) {
      const historicalData: RealtimeChartData[] = [];
      const now = new Date();
      
      for (let i = 24; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const basePrice = bitcoinData.price_brl;
        const variation = (Math.random() - 0.5) * 0.1;
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
    setIsLoading(false);
  }, [bitcoinData]);

  // Set up interval for generic fetching
  useEffect(() => {
    if (fetchFunction && refreshInterval) {
      fetchData();
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchFunction, refreshInterval]);

  // Return different shapes based on usage
  if (fetchFunction && initialData !== undefined && refreshInterval !== undefined) {
    return {
      data: data as T,
      previousData: previousData as T,
      isLoading,
      isRefreshing,
      refresh: fetchData,
      lastUpdated
    };
  }

  return {
    chartData,
    walletData,
    isLoading: !bitcoinData,
    lastUpdate: new Date().toISOString()
  };
}

export const useRealtimeBitcoinPrice = (refreshInterval?: number) => {
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
    previousData: previousPrice ? { price_brl: previousPrice, price_usd: previousPrice / 5.5 } : null,
    isLoading: loading,
    error,
    isRefreshing: false,
    refresh: () => {},
    lastUpdated: new Date()
  };
};

export const useValueChange = (currentValue?: number, previousValue?: number): ValueChangeState => {
  if (currentValue === undefined || currentValue === null) return 'initial';
  if (!previousValue || currentValue === previousValue) return 'neutral';
  return currentValue > previousValue ? 'positive' : 'negative';
};
