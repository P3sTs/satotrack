
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

// Valores padrão para demonstração caso API falhe
const fallbackData: BitcoinPriceData = {
  price_usd: 68750,
  price_brl: 352500,
  price_change_percentage_24h: 1.2,
  market_cap_usd: 1350000000000,
  volume_24h_usd: 28500000000, 
  market_trend: 'bullish',
  last_updated: new Date().toISOString()
};

export const useBitcoinPrice = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSuccess, setLastSuccess] = useState<Date | null>(null);
  const MAX_RETRIES = 3;
  const APIS = [
    {
      name: 'CoinGecko',
      url: 'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
    },
    {
      name: 'CoinCap',
      url: 'https://api.coincap.io/v2/assets/bitcoin'
    },
    {
      name: 'Binance',
      url: 'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'
    }
  ];
  
  // Índice da API atual
  const [currentApiIndex, setCurrentApiIndex] = useState(0);

  const fetchBitcoinData = useCallback(async () => {
    try {
      // Indicar que estamos carregando dados
      if (!isRefreshing && !bitcoinData) {
        setIsLoading(true);
      }
      
      const currentApi = APIS[currentApiIndex];
      console.log(`Tentando API: ${currentApi.name}`);
      
      // Adicionar nonce para prevenir cache
      const nonce = Date.now();
      const apiUrl = `${currentApi.url}${currentApi.url.includes('?') ? '&' : '?'}_=${nonce}`;
      
      // Fazer requisição com timeout de 5 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(apiUrl, { 
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Salvar preço anterior para animação
      if (bitcoinData) {
        setPreviousPrice(bitcoinData.price_usd);
      }
      
      // Formatar dados de acordo com a API
      let formattedData: BitcoinPriceData;
      
      if (currentApi.name === 'CoinGecko') {
        if (!data.market_data) {
          throw new Error('Market data not available');
        }
        
        // Determinar tendência de mercado
        let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
        const priceChange = data.market_data.price_change_percentage_24h;
        
        if (priceChange >= 5) {
          marketTrend = 'bullish';
        } else if (priceChange <= -5) {
          marketTrend = 'bearish';
        }
        
        formattedData = {
          price_usd: data.market_data.current_price.usd,
          price_brl: data.market_data.current_price.brl,
          price_change_percentage_24h: data.market_data.price_change_percentage_24h,
          market_cap_usd: data.market_data.market_cap.usd,
          volume_24h_usd: data.market_data.total_volume.usd,
          market_trend: marketTrend,
          last_updated: data.market_data.last_updated
        };
      } 
      else if (currentApi.name === 'CoinCap') {
        // Estimar BRL com taxa de câmbio aproximada
        const usdToBrl = 5.15; // Taxa aproximada
        const priceUsd = parseFloat(data.data.priceUsd);
        const changePercent = parseFloat(data.data.changePercent24Hr);
        
        let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
        if (changePercent >= 5) {
          marketTrend = 'bullish';
        } else if (changePercent <= -5) {
          marketTrend = 'bearish';
        }
        
        formattedData = {
          price_usd: priceUsd,
          price_brl: priceUsd * usdToBrl,
          price_change_percentage_24h: changePercent,
          market_cap_usd: parseFloat(data.data.marketCapUsd),
          volume_24h_usd: parseFloat(data.data.volumeUsd24Hr),
          market_trend: marketTrend,
          last_updated: new Date().toISOString()
        };
      }
      else if (currentApi.name === 'Binance') {
        // Estimar BRL com taxa de câmbio aproximada
        const usdToBrl = 5.15; // Taxa aproximada
        const priceUsd = parseFloat(data.lastPrice);
        const changePercent = parseFloat(data.priceChangePercent);
        
        let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
        if (changePercent >= 5) {
          marketTrend = 'bullish';
        } else if (changePercent <= -5) {
          marketTrend = 'bearish';
        }
        
        formattedData = {
          price_usd: priceUsd,
          price_brl: priceUsd * usdToBrl,
          price_change_percentage_24h: changePercent,
          market_cap_usd: 0, // Não disponível na Binance API, precisaria estimar
          volume_24h_usd: parseFloat(data.volume),
          market_trend: marketTrend,
          last_updated: new Date().toISOString()
        };
      }
      else {
        throw new Error('API não suportada');
      }
      
      console.log(`${currentApi.name} API respondeu com sucesso:`, formattedData);
      
      setBitcoinData(formattedData);
      setError(null);
      setRetryCount(0); // Zerar contador de tentativas
      setLastSuccess(new Date()); // Marcar timestamp do último sucesso
      setCurrentApiIndex(0); // Voltar para a primeira API preferida
    } catch (err) {
      console.error(`Erro na API ${APIS[currentApiIndex].name}:`, err);
      
      // Tentar próxima API ou reiniciar ciclo
      if (currentApiIndex < APIS.length - 1) {
        console.log(`Tentando próxima API: ${APIS[currentApiIndex + 1].name}`);
        setCurrentApiIndex(currentApiIndex + 1);
        setTimeout(() => {
          fetchBitcoinData();
        }, 1000); // Pequeno delay entre APIs
      } else {
        // Voltamos ao início, incrementar contagem de tentativa
        setCurrentApiIndex(0);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Tentativa ${retryCount + 1} de ${MAX_RETRIES}. Tentando novamente em 3 segundos...`);
          setRetryCount(prevCount => prevCount + 1);
          setTimeout(() => {
            fetchBitcoinData();
          }, 3000);
        } else {
          setError(err instanceof Error ? err : new Error('Failed to fetch Bitcoin data'));
          
          // Se já temos dados, continuar mostrando-os
          if (!bitcoinData) {
            console.log('Usando dados de fallback após falhas em todas as APIs');
            setBitcoinData(fallbackData);
            toast({
              variant: "warning",
              title: "Usando dados offline",
              description: "Não foi possível obter os preços atualizados do Bitcoin."
            });
          } else {
            // Mostrar toast de erro apenas uma vez
            if (!error) {
              toast({
                variant: "warning",
                title: "Erro de atualização",
                description: "Dados podem estar desatualizados. Tentando novamente em breve."
              });
            }
          }
        }
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [bitcoinData, currentApiIndex, error, isRefreshing, retryCount]);
  
  // Initial load
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchBitcoinData();
      }
    };
    
    loadData();
    
    // Set up refresh interval - a cada 15 segundos
    const intervalId = setInterval(() => {
      if (isMounted) {
        setIsRefreshing(true);
        fetchBitcoinData();
      }
    }, 15000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchBitcoinData]);
  
  // Função para atualizar manualmente os dados
  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    fetchBitcoinData();
  }, [fetchBitcoinData]);
  
  return {
    bitcoinData,
    previousPrice,
    isLoading,
    isRefreshing,
    error,
    refreshData,
    lastSuccessUpdate: lastSuccess
  };
};

export default useBitcoinPrice;
