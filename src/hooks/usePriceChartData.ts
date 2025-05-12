
import { useState, useEffect } from 'react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

export interface PriceDataPoint {
  timestamp: number;
  price: number;
}

type TimeRange = '7D' | '30D' | '6M' | '1Y';

export function usePriceChartData(bitcoinData: BitcoinPriceData | null | undefined, timeRange: TimeRange) {
  const [chartData, setChartData] = useState<PriceDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generatePriceData = async () => {
      setIsLoading(true);
      try {
        // Determine time range in milliseconds
        let timeInDays;
        switch (timeRange) {
          case '7D':
            timeInDays = 7;
            break;
          case '30D':
            timeInDays = 30;
            break;
          case '6M':
            timeInDays = 180; // Approximately 6 months
            break;
          case '1Y':
            timeInDays = 365; // 1 year
            break;
          default:
            timeInDays = 7;
        }

        // Calculate start date
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - timeInDays * 24 * 60 * 60 * 1000);
        
        // Generate random data for demonstration
        const data: PriceDataPoint[] = [];
        const currentPrice = bitcoinData?.price_usd || 50000;
        const volatility = 0.02; // 2% volatility
        
        // Generate data points with appropriate interval based on time range
        let interval;
        let points;
        
        if (timeRange === '7D') {
          interval = 3 * 60 * 60 * 1000; // 3 hours
          points = 7 * 8; // 7 days * 8 points per day
        } else if (timeRange === '30D') {
          interval = 24 * 60 * 60 * 1000; // 1 day
          points = 30; // 30 days
        } else if (timeRange === '6M') {
          interval = 7 * 24 * 60 * 60 * 1000; // 1 week
          points = 26; // ~26 weeks in 6 months
        } else { // 1Y
          interval = 14 * 24 * 60 * 60 * 1000; // 2 weeks
          points = 26; // 26 biweekly points in a year
        }
        
        for (let i = 0; i < points; i++) {
          const timestamp = startDate.getTime() + i * interval;
          // Create price with some random fluctuation
          const randomFactor = 1 + (Math.random() - 0.5) * volatility;
          let price;
          
          if (i === 0) {
            // Start with a price somewhat below current price
            price = currentPrice * 0.9;
          } else {
            // Each price is based on previous with random fluctuation
            price = data[i-1].price * randomFactor;
          }
          
          data.push({ timestamp, price });
        }
        
        // Ensure the last point is current price
        if (data.length > 0 && bitcoinData) {
          data[data.length - 1].price = bitcoinData.price_usd;
        }
        
        setChartData(data);
      } catch (error) {
        console.error("Erro ao gerar dados do gráfico de preços:", error);
      }
      setIsLoading(false);
    };

    generatePriceData();
  }, [timeRange, bitcoinData]);

  return { chartData, isLoading };
}
