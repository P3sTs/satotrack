import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the structure of the Bitcoin price data
export interface BitcoinPriceData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number; // Add this property
  volume_24h: number;
  market_cap: number;
  updated_at: string;
}

// Custom hook to fetch Bitcoin price
export const useBitcoinPrice = () => {
  const [data, setData] = useState<BitcoinPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false'
        );

        const bitcoinData: BitcoinPriceData = {
          price_usd: response.data.market_data.current_price.usd,
          price_brl: response.data.market_data.current_price.brl,
          price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
          price_change_percentage_7d: response.data.market_data.price_change_percentage_7d,
          volume_24h: response.data.market_data.total_volume.usd,
          market_cap: response.data.market_data.market_cap.usd,
          updated_at: response.data.market_data.last_updated,
        };

        setData(bitcoinData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Bitcoin price');
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 15 minutes
    const intervalId = setInterval(fetchData, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { data, loading, error };
};
