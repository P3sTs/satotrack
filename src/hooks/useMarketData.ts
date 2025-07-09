import { useState, useEffect, useCallback } from 'react';

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
}

export interface GlobalMarketStats {
  totalMarketCap: number;
  total24hVolume: number;
  marketCapChange24h: number;
  activeCryptocurrencies: number;
  btcDominance: number;
}

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalMarketStats>({
    totalMarketCap: 1800000000000, // $1.8T
    total24hVolume: 85000000000, // $85B
    marketCapChange24h: 5.2,
    activeCryptocurrencies: 13000,
    btcDominance: 52.3
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadMarketData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Em produção, usar API real como CoinGecko ou CoinMarketCap
      // Por ora, dados simulados
      const mockData: MarketData[] = [
        {
          symbol: 'BTC',
          price: 55000,
          change24h: 3.2,
          volume: 28500000000,
          marketCap: 1080000000000
        },
        {
          symbol: 'ETH',
          price: 3620,
          change24h: -1.8,
          volume: 15200000000,
          marketCap: 435000000000
        },
        {
          symbol: 'MATIC',
          price: 0.82,
          change24h: 5.7,
          volume: 850000000,
          marketCap: 8200000000
        },
        {
          symbol: 'SOL',
          price: 114,
          change24h: 4.1,
          volume: 2100000000,
          marketCap: 51000000000
        },
        {
          symbol: 'AVAX',
          price: 43.2,
          change24h: 2.8,
          volume: 780000000,
          marketCap: 17800000000
        }
      ];

      setMarketData(mockData);

      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error('Erro ao carregar dados do mercado:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshMarketData = useCallback(async () => {
    await loadMarketData();
  }, [loadMarketData]);

  useEffect(() => {
    loadMarketData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadMarketData, 30000);
    return () => clearInterval(interval);
  }, [loadMarketData]);

  return {
    marketData,
    globalStats,
    isLoading,
    refreshMarketData
  };
};