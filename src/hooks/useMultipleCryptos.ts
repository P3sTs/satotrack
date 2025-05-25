
import { useState, useEffect, useCallback } from 'react';
import { fetchMultipleCryptos, CryptoData } from '@/services/crypto/cryptoService';

export const useMultipleCryptos = (refreshInterval: number = 60000) => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchMultipleCryptos();
      setCryptos(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Erro ao carregar dados das criptomoedas');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetchData();
  }, [fetchData]);

  return {
    cryptos,
    loading,
    error,
    lastUpdate,
    refresh
  };
};
