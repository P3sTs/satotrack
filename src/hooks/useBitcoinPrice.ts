
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface BitcoinPriceData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  price_change_percentage_1y?: number;
  price_high_7d?: number;
  price_low_7d?: number;
  price_high_30d?: number;
  price_low_30d?: number;
  price_high_1y?: number;
  price_low_1y?: number;
  market_cap: number;
  market_cap_usd?: number;
  volume_24h: number;
  volume_24h_usd?: number;
  last_updated: string;
  market_trend?: 'bullish' | 'bearish' | 'neutral';
}

const MOCK_BITCOIN_DATA: BitcoinPriceData = {
  price_usd: 43250.50,
  price_brl: 224502.60,
  price_change_percentage_24h: 2.34,
  price_change_24h: 1012.50,
  price_change_percentage_7d: 5.67,
  price_change_percentage_30d: -3.45,
  price_change_percentage_1y: 67.89,
  price_high_7d: 45000,
  price_low_7d: 41000,
  price_high_30d: 47000,
  price_low_30d: 39000,
  price_high_1y: 69000,
  price_low_1y: 15000,
  market_cap: 847234567890,
  market_cap_usd: 847234567890,
  volume_24h: 23456789012,
  volume_24h_usd: 23456789012,
  last_updated: new Date().toISOString(),
  market_trend: 'bullish'
};

export const useBitcoinPrice = () => {
  const [data, setData] = useState<BitcoinPriceData | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBitcoinPrice = useCallback(async (showToast = false) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Armazenar preço anterior
      if (data) {
        setPreviousPrice(data.price_usd);
      }

      // Simular pequenas variações no preço
      const variation = (Math.random() - 0.5) * 1000; // Variação de até ±500
      const newPrice = MOCK_BITCOIN_DATA.price_usd + variation;
      const changePercent = ((newPrice - MOCK_BITCOIN_DATA.price_usd) / MOCK_BITCOIN_DATA.price_usd) * 100;
      const change24h = newPrice - MOCK_BITCOIN_DATA.price_usd;

      const newData: BitcoinPriceData = {
        ...MOCK_BITCOIN_DATA,
        price_usd: newPrice,
        price_brl: newPrice * 5.2, // Aproximadamente 1 USD = 5.2 BRL
        price_change_percentage_24h: changePercent,
        price_change_24h: change24h,
        volume_24h_usd: MOCK_BITCOIN_DATA.volume_24h,
        market_cap_usd: MOCK_BITCOIN_DATA.market_cap,
        last_updated: new Date().toISOString(),
        market_trend: changePercent > 1 ? 'bullish' : changePercent < -1 ? 'bearish' : 'neutral'
      };

      setData(newData);
      setError(null);
      
      if (showToast) {
        toast.success('Dados do Bitcoin atualizados');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar dados do Bitcoin';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [data]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchBitcoinPrice(true);
  }, [fetchBitcoinPrice]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchBitcoinPrice();
  }, []);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        fetchBitcoinPrice();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchBitcoinPrice, isRefreshing]);

  return {
    data,
    previousPrice,
    isLoading,
    loading: isLoading, // Add alias for backward compatibility
    isRefreshing,
    error,
    refresh
  };
};
