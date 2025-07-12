import { useState, useEffect, useRef } from 'react';

interface TatumPriceData {
  [symbol: string]: {
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
    lastUpdated: Date;
  };
}

const SUPPORTED_CURRENCIES = ['BTC', 'ETH', 'SOL', 'USDT', 'MATIC'];
const UPDATE_INTERVAL = 120000; // 2 minutos para estabilidade

export const useTatumPrices = () => {
  const [prices, setPrices] = useState<TatumPriceData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTatumPrices = async () => {
    try {
      setError(null);
      
      // Usar CoinGecko como fallback para dados reais
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,matic-network&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true'
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const formattedPrices: TatumPriceData = {
        BTC: {
          price: data.bitcoin?.usd || 0,
          change24h: data.bitcoin?.usd_24h_change || 0,
          volume24h: data.bitcoin?.usd_24h_vol || 0,
          marketCap: data.bitcoin?.usd_market_cap || 0,
          lastUpdated: new Date()
        },
        ETH: {
          price: data.ethereum?.usd || 0,
          change24h: data.ethereum?.usd_24h_change || 0,
          volume24h: data.ethereum?.usd_24h_vol || 0,
          marketCap: data.ethereum?.usd_market_cap || 0,
          lastUpdated: new Date()
        },
        SOL: {
          price: data.solana?.usd || 0,
          change24h: data.solana?.usd_24h_change || 0,
          volume24h: data.solana?.usd_24h_vol || 0,
          marketCap: data.solana?.usd_market_cap || 0,
          lastUpdated: new Date()
        },
        USDT: {
          price: data.tether?.usd || 1,
          change24h: data.tether?.usd_24h_change || 0,
          volume24h: data.tether?.usd_24h_vol || 0,
          marketCap: data.tether?.usd_market_cap || 0,
          lastUpdated: new Date()
        },
        MATIC: {
          price: data['matic-network']?.usd || 0,
          change24h: data['matic-network']?.usd_24h_change || 0,
          volume24h: data['matic-network']?.usd_24h_vol || 0,
          marketCap: data['matic-network']?.usd_market_cap || 0,
          lastUpdated: new Date()
        }
      };

      // Só atualiza se houve mudança significativa (>0.5%)
      setPrices(prevPrices => {
        const hasSignificantChange = SUPPORTED_CURRENCIES.some(symbol => {
          const newPrice = formattedPrices[symbol];
          const oldPrice = prevPrices[symbol];
          
          if (!oldPrice) return true;
          
          const change = Math.abs((newPrice.price - oldPrice.price) / oldPrice.price) * 100;
          return change > 0.5;
        });
        
        return hasSignificantChange ? formattedPrices : prevPrices;
      });

      setLastUpdated(new Date());
      setIsLoading(false);
      
    } catch (err) {
      console.error('Error fetching Tatum prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number, currency: 'USD' | 'BRL' = 'USD') => {
    const locale = currency === 'BRL' ? 'pt-BR' : 'en-US';
    const currencyCode = currency === 'BRL' ? 'BRL' : 'USD';
    const finalPrice = currency === 'BRL' ? price * 5.2 : price; // Taxa aproximada USD -> BRL
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(finalPrice);
  };

  const formatChange = (change: number) => {
    return {
      value: change,
      formatted: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      isPositive: change >= 0
    };
  };

  const getCryptoData = (symbol: string) => {
    const data = prices[symbol.toUpperCase()];
    if (!data) return null;

    return {
      price: data.price,
      priceFormatted: formatPrice(data.price),
      priceBRL: formatPrice(data.price, 'BRL'),
      change24h: formatChange(data.change24h),
      volume24h: data.volume24h,
      marketCap: data.marketCap,
      lastUpdated: data.lastUpdated
    };
  };

  useEffect(() => {
    fetchTatumPrices();
    
    intervalRef.current = setInterval(fetchTatumPrices, UPDATE_INTERVAL);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    prices,
    isLoading,
    error,
    lastUpdated,
    formatPrice,
    formatChange,
    getCryptoData,
    refreshPrices: fetchTatumPrices,
    supportedCurrencies: SUPPORTED_CURRENCIES
  };
};