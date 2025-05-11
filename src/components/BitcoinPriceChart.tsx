
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface PriceData {
  date: string;
  price: number;
}

const BitcoinPriceChart = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily'
        );
        
        if (!response.ok) {
          throw new Error('Falha ao buscar dados históricos');
        }
        
        const data = await response.json();
        
        // Formatar dados para o gráfico
        const formattedData = data.prices.map((item: [number, number]) => {
          const date = new Date(item[0]);
          return {
            date: date.toLocaleDateString(),
            price: item[1]
          };
        });
        
        setPriceData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar histórico de preços:', error);
        setIsLoading(false);
      }
    };
    
    fetchPriceHistory();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bitcoin"></div>
      </div>
    );
  }
  
  if (priceData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Dados indisponíveis</p>
      </div>
    );
  }
  
  const config = {
    bitcoin: {
      color: "#F7931A",
      label: "Bitcoin"
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <ChartContainer config={config} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={priceData}
          margin={{ top: 5, right: 20, bottom: 25, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            width={80}
            domain={['auto', 'auto']}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Card className="p-3 border shadow-md">
                    <p className="font-medium">{data.date}</p>
                    <p className="text-bitcoin font-bold">{formatCurrency(data.price)}</p>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            name="bitcoin"
            stroke="#F7931A"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BitcoinPriceChart;
