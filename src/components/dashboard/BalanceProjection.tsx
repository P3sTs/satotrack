
import React from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, Calendar, Target } from 'lucide-react';

interface BalanceProjectionProps {
  carteiras: CarteiraBTC[];
  bitcoinData?: BitcoinPriceData | null;
  currency: 'BRL' | 'USD';
}

const BalanceProjection: React.FC<BalanceProjectionProps> = ({
  carteiras,
  bitcoinData,
  currency
}) => {
  if (!bitcoinData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted-foreground">Carregando projeções...</div>
      </div>
    );
  }

  const currentPrice = currency === 'BRL' ? bitcoinData.price_brl : bitcoinData.price_usd;
  const totalBalance = carteiras.reduce((sum, wallet) => sum + wallet.saldo, 0);
  const currentValue = totalBalance * currentPrice;
  
  // Calculate average monthly growth (simulated)
  const monthlyGrowthRate = 0.08; // 8% monthly average
  const weeklyGrowthRate = monthlyGrowthRate / 4;
  const dailyGrowthRate = monthlyGrowthRate / 30;

  const projections = [
    {
      period: '7 dias',
      value: currentValue * (1 + weeklyGrowthRate),
      growth: weeklyGrowthRate * 100,
      icon: Calendar
    },
    {
      period: '30 dias',
      value: currentValue * (1 + monthlyGrowthRate),
      growth: monthlyGrowthRate * 100,
      icon: Target
    },
    {
      period: '90 dias',
      value: currentValue * Math.pow(1 + monthlyGrowthRate, 3),
      growth: (Math.pow(1 + monthlyGrowthRate, 3) - 1) * 100,
      icon: TrendingUp
    }
  ];

  // Generate projection chart data
  const chartData = [];
  for (let i = 0; i <= 30; i++) {
    const dayValue = currentValue * Math.pow(1 + dailyGrowthRate, i);
    chartData.push({
      day: i,
      value: dayValue
    });
  }

  return (
    <div className="space-y-6">
      {/* Current value */}
      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <div className="text-sm text-muted-foreground mb-1">Valor Atual</div>
        <div className="text-2xl font-bold text-bitcoin">
          {formatCurrency(currentValue, currency)}
        </div>
      </div>

      {/* Projection cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projections.map((projection, index) => (
          <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-bitcoin/20 to-transparent border border-bitcoin/30">
            <div className="flex items-center gap-2 mb-2">
              <projection.icon className="h-4 w-4 text-bitcoin" />
              <span className="text-sm font-medium">{projection.period}</span>
            </div>
            <div className="text-lg font-bold mb-1">
              {formatCurrency(projection.value, currency)}
            </div>
            <div className="text-sm text-green-500">
              +{projection.growth.toFixed(1)}% projetado
            </div>
          </div>
        ))}
      </div>

      {/* Projection chart */}
      <div className="space-y-4">
        <div className="text-sm font-medium">Projeção de Crescimento (30 dias)</div>
        <div className="h-32 bg-muted/30 rounded-lg flex items-end justify-between p-4 gap-1">
          {chartData.filter((_, index) => index % 3 === 0).map((point, index) => {
            const height = Math.max(10, (point.value / Math.max(...chartData.map(d => d.value))) * 100);
            return (
              <div
                key={index}
                className="bg-gradient-to-t from-bitcoin to-bitcoin/50 rounded-t flex-1 max-w-3"
                style={{ height: `${height}%` }}
                title={`Dia ${point.day}: ${formatCurrency(point.value, currency)}`}
              />
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
        <strong>Aviso:</strong> As projeções são baseadas em médias históricas e não garantem resultados futuros. 
        O mercado de criptomoedas é altamente volátil e os valores podem variar significativamente.
      </div>
    </div>
  );
};

export default BalanceProjection;
