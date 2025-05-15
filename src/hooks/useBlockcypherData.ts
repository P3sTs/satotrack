
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface BlockcypherData {
  name: string;
  height: number;
  hash: string;
  time: string;
  latest_url: string;
  previous_hash: string;
  previous_url: string;
  peer_count: number;
  unconfirmed_count: number;
  high_fee_per_kb: number;
  medium_fee_per_kb: number;
  low_fee_per_kb: number;
  last_fork_height: number;
  last_fork_hash: string;
}

export type CryptoCurrency = 'btc' | 'ltc' | 'dash' | 'doge';

export function useBlockcypherData(currency: CryptoCurrency, refreshInterval = 60000) {
  const [data, setData] = useState<BlockcypherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`https://api.blockcypher.com/v1/${currency}/main`);
      
      if (!response.ok) {
        throw new Error(`Error fetching ${currency.toUpperCase()} data: ${response.statusText}`);
      }
      
      const result: BlockcypherData = await response.json();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${currency} data:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: `Error fetching ${currency.toUpperCase()} data`,
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currency]);

  // Initial fetch
  useEffect(() => {
    fetchData();
    
    // Set up interval for automatic refreshes
    const intervalId = setInterval(fetchData, refreshInterval);
    
    // Clean up interval
    return () => clearInterval(intervalId);
  }, [fetchData, refreshInterval]);

  // Manual refresh function
  const refresh = () => {
    fetchData();
  };

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    isRefreshing,
    refresh
  };
}
