
import { useState, useEffect, useCallback } from 'react';
import { useRealTimePrices } from './useRealTimePrices';

export interface BitcoinPriceData {
  price_usd: number;
  price_brl: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  price_change_percentage_1y?: number;
  market_cap_usd: number;
  market_cap?: number;
  volume_24h_usd: number;
  volume_24h?: number;
  circulating_supply: number;
  last_updated: string;
  updated_at?: string;
  market_trend?: 'bullish' | 'bearish' | 'neutral';
  price_low_7d?: number;
  price_high_7d?: number;
  price_low_30d?: number;
  price_high_30d?: number;
  price_low_1y?: number;
  price_high_1y?: number;
}

export const useBitcoinPrice = () => {
  const [data, setData] = useState<BitcoinPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { prices, isLoading: pricesLoading, fetchPrices, lastUpdated } = useRealTimePrices(['bitcoin']);
  
  // Buscar dados adicionais do CoinGecko (mercado, etc)
  const fetchAdditionalData = useCallback(async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
      );
      
      if (!response.ok) throw new Error('Falha ao buscar dados do CoinGecko');
      
      const coinData = await response.json();
      
      // Determinar a tendência do mercado com tipo correto
      const changePercentage = coinData.market_data.price_change_percentage_24h || 0;
      let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      
      if (changePercentage >= 3) {
        marketTrend = 'bullish';
      } else if (changePercentage <= -3) {
        marketTrend = 'bearish';
      }
      
      return {
        price_change_24h: coinData.market_data.price_change_24h || 0,
        price_change_percentage_24h: coinData.market_data.price_change_percentage_24h || 0,
        price_change_percentage_7d: coinData.market_data.price_change_percentage_7d || 0,
        price_change_percentage_30d: coinData.market_data.price_change_percentage_30d || 0,
        price_change_percentage_1y: coinData.market_data.price_change_percentage_1y || 0,
        market_cap_usd: coinData.market_data.market_cap?.usd || 0,
        market_cap: coinData.market_data.market_cap?.usd || 0,
        volume_24h_usd: coinData.market_data.total_volume?.usd || 0,
        volume_24h: coinData.market_data.total_volume?.usd || 0,
        circulating_supply: coinData.market_data.circulating_supply || 0,
        price_low_7d: coinData.market_data.low_24h || 0,
        price_high_7d: coinData.market_data.high_24h || 0,
        price_low_30d: coinData.market_data.low_24h || 0,
        price_high_30d: coinData.market_data.high_24h || 0,
        price_low_1y: coinData.market_data.low_24h || 0,
        price_high_1y: coinData.market_data.high_24h || 0,
        market_trend: marketTrend
      };
    } catch (err) {
      console.error('Erro ao buscar dados do CoinGecko:', err);
      // Em caso de erro, retornar valores padrão
      return {
        price_change_24h: 0,
        price_change_percentage_24h: 0,
        price_change_percentage_7d: 0,
        price_change_percentage_30d: 0,
        price_change_percentage_1y: 0,
        market_cap_usd: 0,
        market_cap: 0,
        volume_24h_usd: 0,
        volume_24h: 0,
        circulating_supply: 0,
        price_low_7d: 0,
        price_high_7d: 0,
        price_low_30d: 0,
        price_high_30d: 0,
        price_low_1y: 0,
        price_high_1y: 0,
        market_trend: 'neutral' as const
      };
    }
  }, []);
  
  const updateBitcoinData = useCallback(async () => {
    // Se já tivermos dados, salvar o preço anterior
    if (data) {
      setPreviousPrice(data.price_usd);
    }
    
    try {
      setIsRefreshing(true);
      
        // Se temos preços do nosso serviço
        if (prices && prices.bitcoin) {
          // Buscar dados adicionais
          const additionalData = await fetchAdditionalData();
          
          const newData: BitcoinPriceData = {
            price_usd: prices.bitcoin.usd,
            price_brl: prices.bitcoin.brl,
            last_updated: lastUpdated ? lastUpdated.toISOString() : new Date().toISOString(),
            updated_at: lastUpdated ? lastUpdated.toISOString() : new Date().toISOString(),
            ...additionalData
          };
        
        setData(newData);
        setError(null);
      } else {
        throw new Error('Preços não disponíveis');
      }
    } catch (err) {
      console.error('Erro ao atualizar dados do Bitcoin:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [prices, lastUpdated, data, fetchAdditionalData]);
  
  // Atualizar quando os preços mudarem
  useEffect(() => {
    if (!pricesLoading && prices) {
      updateBitcoinData();
    }
  }, [prices, pricesLoading, updateBitcoinData]);
  
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPrices();
    setIsRefreshing(false);
  }, [fetchPrices]);
  
  return { data, loading, error, previousPrice, isRefreshing, refresh };
};
