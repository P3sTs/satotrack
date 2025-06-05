
import React from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ProfitLossIndicatorProps {
  carteiras: CarteiraBTC[];
  bitcoinData?: BitcoinPriceData | null;
  currency: 'BRL' | 'USD';
}

const ProfitLossIndicator: React.FC<ProfitLossIndicatorProps> = ({
  carteiras,
  bitcoinData,
  currency
}) => {
  if (!bitcoinData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted-foreground">Carregando dados do mercado...</div>
      </div>
    );
  }

  const totalBalance = carteiras.reduce((sum, wallet) => sum + wallet.saldo, 0);
  const totalReceived = carteiras.reduce((sum, wallet) => sum + wallet.total_entradas, 0);
  const totalSent = carteiras.reduce((sum, wallet) => sum + wallet.total_saidas, 0);
  
  const currentPrice = currency === 'BRL' ? bitcoinData.price_brl : bitcoinData.price_usd;
  const currentValue = totalBalance * currentPrice;
  
  // Simulated profit/loss calculation (in a real app, you'd track purchase prices)
  const estimatedCost = totalReceived * currentPrice * 0.9; // Assuming 10% average gain
  const profitLoss = currentValue - estimatedCost;
  const profitLossPercentage = estimatedCost > 0 ? (profitLoss / estimatedCost) * 100 : 0;
  
  const isProfit = profitLoss > 0;

  // Generate mock chart data for the last 30 days
  const generateChartData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulate balance evolution with some randomness
      const baseValue = currentValue;
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const dayValue = baseValue * (1 + variation);
      
      data.push({
        date: date.toLocaleDateString('pt-BR'),
        value: dayValue,
        btcAmount: totalBalance
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="space-y-6">
      {/* Profit/Loss Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground mb-1">Valor Atual</div>
          <div className="text-lg font-bold">
            {formatCurrency(currentValue, currency)}
          </div>
        </div>
        
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground mb-1">Custo Estimado</div>
          <div className="text-lg font-bold">
            {formatCurrency(estimatedCost, currency)}
          </div>
        </div>
        
        <div className={`text-center p-4 rounded-lg ${isProfit ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <div className="text-sm text-muted-foreground mb-1">Lucro/Prejuízo</div>
          <div className={`text-lg font-bold flex items-center justify-center gap-1 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
            {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {formatCurrency(Math.abs(profitLoss), currency)}
          </div>
          <div className={`text-sm ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
            {isProfit ? '+' : ''}{profitLossPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Simplified chart visualization */}
      <div className="space-y-4">
        <div className="text-sm font-medium">Evolução dos Últimos 30 Dias</div>
        <div className="h-48 bg-muted/30 rounded-lg flex items-end justify-between p-4 gap-1">
          {chartData.map((point, index) => {
            const height = Math.max(10, (point.value / Math.max(...chartData.map(d => d.value))) * 100);
            return (
              <div
                key={index}
                className="bg-bitcoin rounded-t flex-1 max-w-2"
                style={{ height: `${height}%` }}
                title={`${point.date}: ${formatCurrency(point.value, currency)}`}
              />
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>30 dias atrás</span>
          <span>Hoje</span>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossIndicator;
