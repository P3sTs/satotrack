
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface BitcoinPriceData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  last_updated: string;
  market_trend: 'bullish' | 'bearish' | 'neutral';
}

export function useBitcoinPrice(pollingInterval = 10000) {
  const [data, setData] = useState<BitcoinPriceData | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchBitcoinData = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
      );
      
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do Bitcoin');
      }
      
      const apiData = await response.json();
      
      // Store previous price before updating
      if (data?.price_usd) {
        setPreviousPrice(data.price_usd);
      }

      // Determine market trend
      const changePercentage = apiData.market_data.price_change_percentage_24h;
      let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      
      if (changePercentage >= 3) {
        marketTrend = 'bullish';
      } else if (changePercentage <= -3) {
        marketTrend = 'bearish';
      }
      
      const newData = {
        price_usd: apiData.market_data.current_price.usd,
        price_brl: apiData.market_data.current_price.brl,
        price_change_percentage_24h: apiData.market_data.price_change_percentage_24h,
        market_cap_usd: apiData.market_data.market_cap.usd,
        volume_24h_usd: apiData.market_data.total_volume.usd,
        last_updated: apiData.market_data.last_updated,
        market_trend: marketTrend
      };
      
      setData(newData);
      setIsLoading(false);
      setIsRefreshing(false);

      // Check for significant price movements
      if (previousPrice && Math.abs((newData.price_usd - previousPrice) / previousPrice * 100) >= 5) {
        const direction = newData.price_usd > previousPrice ? 'subiu' : 'caiu';
        toast({
          title: `Alerta de Movimento Significativo!`,
          description: `O preço do Bitcoin ${direction} mais de 5% em um curto período!`,
          variant: newData.price_usd > previousPrice ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do Bitcoin:', error);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchBitcoinData();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      fetchBitcoinData();
    }, pollingInterval);
    
    // Clear interval when component is unmounted
    return () => clearInterval(intervalId);
  }, [pollingInterval]);
  
  const manualRefresh = () => {
    fetchBitcoinData();
    toast({
      title: "Dados atualizados",
      description: "Os dados de mercado do Bitcoin foram atualizados.",
    });
  };
  
  return {
    data,
    previousPrice,
    isLoading,
    isRefreshing,
    refresh: manualRefresh
  };
}
