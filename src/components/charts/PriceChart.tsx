
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';

interface PriceChartProps {
  bitcoinData: BitcoinPriceData | null | undefined;
  timeRange: '1D' | '7D' | '30D';
}

interface PriceDataPoint {
  timestamp: number;
  price: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ bitcoinData, timeRange }) => {
  const [chartData, setChartData] = useState<PriceDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true);
      try {
        // Determine time range in milliseconds
        let timeInDays;
        switch (timeRange) {
          case '1D':
            timeInDays = 1;
            break;
          case '7D':
            timeInDays = 7;
            break;
          case '30D':
            timeInDays = 30;
            break;
          default:
            timeInDays = 7;
        }

        // Calculate start date
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - timeInDays * 24 * 60 * 60 * 1000);
        
        // Generate random data for demonstration
        // In a real application, this would be replaced with API calls
        const data: PriceDataPoint[] = [];
        const currentPrice = bitcoinData?.price_usd || 50000;
        const volatility = 0.02; // 2% volatility
        
        // Generate data points - one per day for 30D, hourly for 7D, every 30 min for 1D
        let interval;
        let points;
        
        if (timeRange === '1D') {
          interval = 30 * 60 * 1000; // 30 minutes
          points = 48; // 48 points in a day (30 min intervals)
        } else if (timeRange === '7D') {
          interval = 3 * 60 * 60 * 1000; // 3 hours
          points = 7 * 8; // 7 days * 8 points per day
        } else {
          interval = 24 * 60 * 60 * 1000; // 1 day
          points = 30; // 30 days
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
        console.error("Erro ao carregar dados do gráfico:", error);
      }
      setIsLoading(false);
    };

    fetchPriceData();
  }, [timeRange, bitcoinData]);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatXAxis = (timestamp: number) => {
    if (timeRange === '1D') {
      return format(timestamp, 'HH:mm', { locale: ptBR });
    } else if (timeRange === '7D') {
      return format(timestamp, 'EEE', { locale: ptBR });
    } else {
      return format(timestamp, 'dd/MM', { locale: ptBR });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center w-full h-60">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bitcoin"></div>
    </div>;
  }
  
  if (chartData.length === 0) {
    return <div className="flex items-center justify-center w-full h-60">
      <p className="text-muted-foreground">Dados não disponíveis</p>
    </div>;
  }

  return (
    <div className="w-full h-60 md:h-72">
      <ChartContainer
        config={{
          price: {
            label: "Preço USD",
            color: "#f7931a",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f7931a" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f7931a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
            />
            <YAxis 
              tickFormatter={formatValue}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              width={60}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.3} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-dashboard-dark border border-dashboard-medium/50 p-2 rounded shadow-md">
                      <p className="text-xs">{format(data.timestamp, 'PPpp', { locale: ptBR })}</p>
                      <p className="text-sm font-semibold text-bitcoin">
                        {formatValue(data.price)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#f7931a"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default PriceChart;
