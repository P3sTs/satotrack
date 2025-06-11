
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CryptoPrices {
  BTC_USD: number;
  BTC_BRL: number;
  ETH_USD: number;
  ETH_BRL: number;
  BNB_USD: number;
  BNB_BRL: number;
  USD_BRL: number;
  [key: string]: number;
}

interface PriceResponse {
  success: boolean;
  data: {
    prices: CryptoPrices;
    timestamp: string;
  };
  cached: boolean;
  cache_age_seconds?: number;
}

export const useRealtimePrices = (refreshInterval = 60000) => {
  const [prices, setPrices] = useState<CryptoPrices | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const fetchPrices = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      const { data, error } = await supabase.functions.invoke('crypto-prices');
      
      if (error) throw new Error(error.message);
      
      const response = data as PriceResponse;
      
      if (response.success && response.data && response.data.prices) {
        setPrices(response.data.prices);
        setLastUpdated(new Date(response.data.timestamp));
        setError(null);
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (err) {
      console.error('Erro ao buscar preços:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);
  
  // Carregar preços iniciais
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);
  
  // Configurar intervalo para atualização
  useEffect(() => {
    if (refreshInterval <= 0) return;
    
    const intervalId = setInterval(fetchPrices, refreshInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchPrices, refreshInterval]);
  
  return {
    prices,
    isLoading,
    error,
    lastUpdated,
    isRefreshing,
    refresh: fetchPrices
  };
};
