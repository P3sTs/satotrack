
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

// Dados de exemplo para o gráfico (serão substituídos por dados reais da API)
const generateDummyData = () => {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setMinutes(now.getMinutes() - i * 10);
    
    const basePrice = 50000 + Math.random() * 5000;
    const open = basePrice;
    const close = basePrice * (0.99 + Math.random() * 0.02);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (0.99 - Math.random() * 0.01);
    
    data.push({
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' }),
      value: close,
      open,
      close,
      high,
      low,
    });
  }
  return data;
};

interface BitcoinCandlestickChartProps {
  priceUSD: number;
  changePercentage: number;
}

const BitcoinCandlestickChart = ({ priceUSD, changePercentage }: BitcoinCandlestickChartProps) => {
  const data = generateDummyData();
  const isPositive = changePercentage >= 0;
  
  return (
    <Card className="bitcoin-card border-none shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gráfico BTCUSD</CardTitle>
          <div className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive ? '+' : ''}{changePercentage.toFixed(2)}%
          </div>
        </div>
        <CardDescription>
          Preço atual: {formatCurrency(priceUSD, 'USD')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ChartContainer 
            className="w-full h-full"
            config={{
              bitcoin: {
                label: 'Bitcoin',
                color: isPositive ? '#10B981' : '#EF4444',
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPositive ? '#10B981' : '#EF4444'} 
                      stopOpacity={0.8}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPositive ? '#10B981' : '#EF4444'} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  domain={['dataMin - 500', 'dataMax + 500']}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          className="border-none"
                          indicator="line"
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  name="bitcoin"
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#10B981' : '#EF4444'}
                  fillOpacity={1}
                  fill="url(#colorBtc)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BitcoinCandlestickChart;
