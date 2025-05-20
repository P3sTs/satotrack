
import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the structure of the Bitcoin price data
export interface BitcoinPriceData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d?: number;  // Added
  price_change_percentage_1y?: number;   // Added
  price_change_24h?: number;            // Added
  volume_24h: number;
  market_cap: number;
  updated_at: string;
  last_updated: string;
  price_low_7d?: number;                // Added
  price_high_7d?: number;               // Added
  price_low_30d?: number;               // Added
  price_high_30d?: number;              // Added
  price_low_1y?: number;                // Added
  price_high_1y?: number;               // Added
  market_trend?: 'bullish' | 'bearish' | 'neutral';
}

// Custom hook to fetch Bitcoin price
export const useBitcoinPrice = () => {
  const [data, setData] = useState<BitcoinPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      
      // If we have current data, save the price for comparison
      if (data) {
        setPreviousPrice(data.price_usd);
      }
      
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false'
      );

      const bitcoinData: BitcoinPriceData = {
        price_usd: response.data.market_data.current_price.usd,
        price_brl: response.data.market_data.current_price.brl,
        price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
        price_change_percentage_7d: response.data.market_data.price_change_percentage_7d || 0, // Fallback if not available
        price_change_percentage_30d: response.data.market_data.price_change_percentage_30d || 0,
        price_change_percentage_1y: response.data.market_data.price_change_percentage_1y || 0,
        price_change_24h: response.data.market_data.price_change_24h_in_currency?.usd || 0,
        volume_24h: response.data.market_data.total_volume.usd,
        market_cap: response.data.market_data.market_cap.usd,
        updated_at: response.data.market_data.last_updated,
        last_updated: response.data.market_data.last_updated,
        
        // Add high/low data (this would come from API in production)
        price_low_7d: response.data.market_data.low_24h?.usd * 0.95 || 0,
        price_high_7d: response.data.market_data.high_24h?.usd * 1.05 || 0,
        price_low_30d: response.data.market_data.low_24h?.usd * 0.9 || 0,
        price_high_30d: response.data.market_data.high_24h?.usd * 1.1 || 0,
        price_low_1y: response.data.market_data.low_24h?.usd * 0.7 || 0,
        price_high_1y: response.data.market_data.high_24h?.usd * 1.3 || 0,
        
        // Determine market trend based on 24h price change
        market_trend: response.data.market_data.price_change_percentage_24h > 1 
          ? 'bullish' 
          : response.data.market_data.price_change_percentage_24h < -1 
            ? 'bearish' 
            : 'neutral'
      };

      setData(bitcoinData);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Bitcoin price');
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Refresh data every 15 minutes
    const intervalId = setInterval(fetchData, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Add a refresh function to allow manual refresh
  const refresh = () => {
    fetchData();
  };

  return { 
    data, 
    loading, 
    error, 
    previousPrice, 
    isLoading: loading, 
    isRefreshing, 
    refresh 
  };
};
