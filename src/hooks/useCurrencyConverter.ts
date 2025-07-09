import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ExchangeRateResponse {
  from: string;
  to: string;
  value: number;
  timestamp: number;
}

export const useCurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [reverseMode, setReverseMode] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Cache para evitar múltiplas chamadas
  const [rateCache, setRateCache] = useState<Record<string, { rate: number; timestamp: number }>>({});

  const CACHE_DURATION = 10000; // 10 segundos
  const MIN_FETCH_INTERVAL = 10000; // 10 segundos entre fetches

  const fetchExchangeRate = useCallback(async (from: string, to: string): Promise<number | null> => {
    const now = Date.now();
    const cacheKey = `${from}-${to}`;
    const cachedRate = rateCache[cacheKey];

    // Verificar cache
    if (cachedRate && (now - cachedRate.timestamp) < CACHE_DURATION) {
      return cachedRate.rate;
    }

    // Verificar intervalo mínimo entre fetches
    if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
      toast.info('Aguarde 10 segundos antes de atualizar novamente');
      return null;
    }

    try {
      setIsLoading(true);
      setLastFetchTime(now);

      // Simulação da API Tatum - substituir por chamada real
      const response = await fetch(`/api/tatum/exchange-rate/${from}/${to}`, {
        headers: {
          'Authorization': `Bearer ${process.env.TATUM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Fallback para taxas simuladas quando API não está disponível
        const simulatedRates = getSimulatedRate(from, to);
        if (simulatedRates) {
          const rate = simulatedRates;
          setRateCache(prev => ({
            ...prev,
            [cacheKey]: { rate, timestamp: now }
          }));
          return rate;
        }
        throw new Error('Falha ao obter taxa de câmbio');
      }

      const data: ExchangeRateResponse = await response.json();
      const rate = data.value;

      // Atualizar cache
      setRateCache(prev => ({
        ...prev,
        [cacheKey]: { rate, timestamp: now }
      }));

      return rate;
    } catch (error) {
      console.error('Erro ao buscar taxa de câmbio:', error);
      
      // Fallback para taxas simuladas
      const simulatedRate = getSimulatedRate(from, to);
      if (simulatedRate) {
        const rate = simulatedRate;
        setRateCache(prev => ({
          ...prev,
          [cacheKey]: { rate, timestamp: now }
        }));
        toast.info('Usando cotação simulada (API em desenvolvimento)');
        return rate;
      }
      
      toast.error('Erro ao obter cotação. Tente novamente.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [rateCache, lastFetchTime]);

  // Taxas simuladas para desenvolvimento
  const getSimulatedRate = (from: string, to: string): number | null => {
    const baseRates: Record<string, Record<string, number>> = {
      'BTC': {
        'BRL': 280000,
        'USD': 52000,
        'EUR': 48000,
        'ETH': 16.5,
        'USDT': 52000
      },
      'ETH': {
        'BRL': 17000,
        'USD': 3150,
        'EUR': 2900,
        'BTC': 0.061,
        'USDT': 3150
      },
      'USDT': {
        'BRL': 5.41,
        'USD': 1.00,
        'EUR': 0.92,
        'BTC': 0.000019,
        'ETH': 0.00032
      },
      'MATIC': {
        'BRL': 4.50,
        'USD': 0.83,
        'EUR': 0.76,
        'BTC': 0.000016,
        'ETH': 0.00026
      },
      'SOL': {
        'BRL': 950,
        'USD': 176,
        'EUR': 162,
        'BTC': 0.0034,
        'ETH': 0.056
      }
    };

    // Taxas fiat para fiat
    const fiatRates: Record<string, Record<string, number>> = {
      'BRL': {
        'USD': 0.185,
        'EUR': 0.170,
        'GBP': 0.145,
        'JPY': 27.5,
        'CAD': 0.25
      },
      'USD': {
        'BRL': 5.41,
        'EUR': 0.92,
        'GBP': 0.78,
        'JPY': 148.5,
        'CAD': 1.35
      }
    };

    // Verificar taxa direta
    if (baseRates[from]?.[to]) {
      return baseRates[from][to] * (0.98 + Math.random() * 0.04); // Variação de ±2%
    }

    if (fiatRates[from]?.[to]) {
      return fiatRates[from][to] * (0.99 + Math.random() * 0.02); // Variação de ±1%
    }

    // Verificar taxa inversa
    if (baseRates[to]?.[from]) {
      return (1 / baseRates[to][from]) * (0.98 + Math.random() * 0.04);
    }

    if (fiatRates[to]?.[from]) {
      return (1 / fiatRates[to][from]) * (0.99 + Math.random() * 0.02);
    }

    return null;
  };

  const updateExchangeRate = useCallback(async () => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      return;
    }

    const rate = await fetchExchangeRate(fromCurrency, toCurrency);
    if (rate) {
      setExchangeRate(rate);
      setLastUpdate(new Date());
      
      // Calcular conversão baseada no modo
      if (reverseMode && toAmount) {
        const newFromAmount = (parseFloat(toAmount) / rate).toString();
        setFromAmount(newFromAmount);
      } else if (!reverseMode && fromAmount) {
        const newToAmount = (parseFloat(fromAmount) * rate).toString();
        setToAmount(newToAmount);
      }
    }
  }, [fromCurrency, toCurrency, fromAmount, toAmount, reverseMode, fetchExchangeRate]);

  // Atualizar quando valor de origem muda (modo normal)
  useEffect(() => {
    if (!reverseMode && fromAmount && exchangeRate && !isLoading) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        setToAmount((amount * exchangeRate).toString());
      }
    }
  }, [fromAmount, exchangeRate, reverseMode, isLoading]);

  // Atualizar quando valor de destino muda (modo reverso)
  useEffect(() => {
    if (reverseMode && toAmount && exchangeRate && !isLoading) {
      const amount = parseFloat(toAmount);
      if (!isNaN(amount)) {
        setFromAmount((amount / exchangeRate).toString());
      }
    }
  }, [toAmount, exchangeRate, reverseMode, isLoading]);

  // Atualizar taxa quando moedas mudam
  useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      updateExchangeRate();
    }
  }, [fromCurrency, toCurrency, updateExchangeRate]);

  const swapCurrencies = useCallback(() => {
    const tempFrom = fromCurrency;
    const tempTo = toCurrency;
    const tempFromAmount = fromAmount;
    const tempToAmount = toAmount;
    
    setFromCurrency(tempTo);
    setToCurrency(tempFrom);
    setFromAmount(tempToAmount);
    setToAmount(tempFromAmount);
    setReverseMode(false);
  }, [fromCurrency, toCurrency, fromAmount, toAmount]);

  return {
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    exchangeRate,
    isLoading,
    lastUpdate,
    reverseMode,
    setFromCurrency,
    setToCurrency,
    setFromAmount,
    setToAmount,
    setReverseMode,
    swapCurrencies,
    updateExchangeRate
  };
};