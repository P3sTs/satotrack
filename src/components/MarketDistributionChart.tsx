
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface MarketData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#F7931A', '#627EEA', '#8A92B2', '#2775CA', '#F0B90B', '#E84142', '#2BAF7F'];

const MarketDistributionChart = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/global'
        );
        
        if (!response.ok) {
          throw new Error('Falha ao buscar dados de mercado');
        }
        
        const data = await response.json();
        const marketCapPercentage = data.data.market_cap_percentage;
        
        // Formatar dados para o gráfico
        const formattedData = Object.entries(marketCapPercentage)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 6) // Pegar as 6 maiores criptomoedas
          .map(([name, value], index) => ({
            name: name.toUpperCase(),
            value: value,
            color: COLORS[index % COLORS.length]
          }));
        
        // Adicionar "Outros" para o restante
        const topCoinsTotal = formattedData.reduce((acc, coin) => acc + coin.value, 0);
        if (topCoinsTotal < 100) {
          formattedData.push({
            name: 'Outros',
            value: 100 - topCoinsTotal,
            color: COLORS[6]
          });
        }
        
        setMarketData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados de distribuição do mercado:', error);
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bitcoin"></div>
      </div>
    );
  }
  
  if (marketData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Dados indisponíveis</p>
      </div>
    );
  }
  
  const config = {};
  
  marketData.forEach((item) => {
    config[item.name.toLowerCase()] = {
      color: item.color,
      label: item.name
    };
  });
  
  return (
    <ChartContainer config={config} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={marketData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            labelLine={false}
          >
            {marketData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
              />
            ))}
          </Pie>
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            formatter={(value, entry, index) => marketData[index].name}
          />
          <Tooltip
            formatter={(value) => [`${value.toFixed(2)}%`, 'Dominância']}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Card className="p-3 border shadow-md">
                    <p className="font-medium">{data.name}</p>
                    <p className="font-bold">{data.value.toFixed(2)}% do mercado</p>
                  </Card>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MarketDistributionChart;
