
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface BitcoinPriceData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  market_trend: 'bullish' | 'bearish' | 'neutral';
  last_updated: string;
}

export const useBitcoinPrice = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchBitcoinData = useCallback(async () => {
    try {
      // CoinGecko API endpoint
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.market_data) {
        throw new Error('Market data not available');
      }
      
      // Determine market trend based on price change
      let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      const priceChange = data.market_data.price_change_percentage_24h;
      
      if (priceChange >= 5) {
        marketTrend = 'bullish';
      } else if (priceChange <= -5) {
        marketTrend = 'bearish';
      }
      
      // Save previous price for animation purposes
      if (bitcoinData) {
        setPreviousPrice(bitcoinData.price_usd);
      }
      
      // Format data
      const formattedData: BitcoinPriceData = {
        price_usd: data.market_data.current_price.usd,
        price_brl: data.market_data.current_price.brl,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        market_cap_usd: data.market_data.market_cap.usd,
        volume_24h_usd: data.market_data.total_volume.usd,
        market_trend: marketTrend,
        last_updated: data.market_data.last_updated
      };
      
      setBitcoinData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching Bitcoin data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch Bitcoin data'));
      
      // Show error toast only once
      if (!error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados do mercado",
          description: "Não foi possível obter os dados de preço do Bitcoin."
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [bitcoinData, error]);
  
  // Initial load
  useEffect(() => {
    fetchBitcoinData();
    
    // Set up 15-second refresh interval
    const intervalId = setInterval(() => {
      fetchBitcoinData();
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, [fetchBitcoinData]);
  
  // Function to manually refresh data
  const refreshData = () => {
    setIsRefreshing(true);
    fetchBitcoinData();
  };
  
  return {
    bitcoinData,
    previousPrice,
    isLoading,
    isRefreshing,
    error,
    refreshData
  };
};

export default useBitcoinPrice;
