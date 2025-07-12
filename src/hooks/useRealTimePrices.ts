import { useState, useEffect, useRef } from 'react';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
}

interface PriceData {
  [key: string]: {
    brl: number;
    usd: number;
    brl_24h_change: number;
    usd_24h_change: number;
  };
}

export const useRealTimePrices = (cryptoIds: string[] = ['bitcoin', 'ethereum', 'solana', 'matic-network', 'binancecoin']) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPrices = async () => {
    try {
      setError(null);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=brl,usd&include_24hr_change=true`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Só atualiza se os dados realmente mudaram significativamente
      setPrices(prevPrices => {
        const hasSignificantChange = Object.keys(data).some(id => {
          const newPrice = data[id];
          const oldPrice = prevPrices[id];
          
          if (!oldPrice) return true;
          
          // Só atualiza se mudança for > 0.1%
          const change = Math.abs((newPrice.brl - oldPrice.brl) / oldPrice.brl) * 100;
          return change > 0.1;
        });
        
        return hasSignificantChange ? data : prevPrices;
      });
      
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number, currency: 'BRL' | 'USD' = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatChange = (change: number) => {
    return {
      value: change,
      formatted: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      isPositive: change >= 0
    };
  };

  const getCryptoData = (cryptoId: string) => {
    const data = prices[cryptoId];
    if (!data) return null;

    return {
      priceBRL: data.brl,
      priceUSD: data.usd,
      formattedPriceBRL: formatPrice(data.brl, 'BRL'),
      formattedPriceUSD: formatPrice(data.usd, 'USD'),
      change24h: formatChange(data.brl_24h_change || 0),
      changeUSD24h: formatChange(data.usd_24h_change || 0)
    };
  };

  useEffect(() => {
    // Fetch immediately
    fetchPrices();

    // Set up interval for updates every 60 seconds (menos frequente para evitar mudanças constantes)
    intervalRef.current = setInterval(fetchPrices, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cryptoIds.join(',')]);

  return {
    prices,
    isLoading,
    lastUpdated,
    error,
    fetchPrices,
    formatPrice,
    formatChange,
    getCryptoData
  };
};