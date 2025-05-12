
import { useState, useEffect, useRef } from 'react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { toast } from '@/hooks/use-toast';

/**
 * Hook personalizado para buscar dados em tempo real com intervalo configurável
 */
export function useRealtimeData<T>(
  fetchFunction: () => Promise<T>,
  initialData: T | null = null,
  interval = 30000, // 30 segundos padrão
  enableRefresh = true
) {
  const [data, setData] = useState<T | null>(initialData);
  const [previousData, setPreviousData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(initialData === null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const newData = await fetchFunction();
      
      // Armazenar dados anteriores antes de atualizar
      setPreviousData(data);
      setData(newData);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({
        title: "Falha na atualização",
        description: "Não foi possível atualizar os dados em tempo real.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Buscar dados iniciais e configurar intervalo
  useEffect(() => {
    fetchData();
    
    if (enableRefresh) {
      intervalRef.current = setInterval(fetchData, interval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, enableRefresh]);
  
  // Função para forçar atualização manual
  const refresh = () => {
    fetchData();
  };
  
  return {
    data,
    previousData,
    isLoading,
    isRefreshing,
    lastUpdated,
    refresh
  };
}

// Tipo específico para comparar valores numéricos e detectar mudanças
export type ValueChangeState = 'increased' | 'decreased' | 'unchanged' | 'initial';

/**
 * Hook para detectar mudanças em valores numéricos
 */
export function useValueChange(
  currentValue: number | undefined | null, 
  previousValue: number | undefined | null
): ValueChangeState {
  if (currentValue === undefined || currentValue === null) return 'initial';
  if (previousValue === undefined || previousValue === null) return 'initial';
  
  if (currentValue > previousValue) return 'increased';
  if (currentValue < previousValue) return 'decreased';
  return 'unchanged';
}

// Hook específico para dados do Bitcoin em tempo real
export function useRealtimeBitcoinPrice(interval = 30000) {
  return useRealtimeData<BitcoinPriceData>(
    async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
      );
      
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do Bitcoin');
      }
      
      const apiData = await response.json();
      
      // Determinar a tendência do mercado
      const changePercentage = apiData.market_data.price_change_percentage_24h;
      let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      
      if (changePercentage >= 3) {
        marketTrend = 'bullish';
      } else if (changePercentage <= -3) {
        marketTrend = 'bearish';
      }
      
      return {
        price_usd: apiData.market_data.current_price.usd,
        price_brl: apiData.market_data.current_price.brl,
        price_change_percentage_24h: apiData.market_data.price_change_percentage_24h,
        market_cap_usd: apiData.market_data.market_cap.usd,
        volume_24h_usd: apiData.market_data.total_volume.usd,
        last_updated: apiData.market_data.last_updated,
        market_trend: marketTrend
      };
    },
    null,
    interval
  );
}
