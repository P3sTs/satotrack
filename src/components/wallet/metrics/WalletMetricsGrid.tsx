
import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, LineChart } from 'lucide-react';
import { formatBitcoinValue, formatCurrency } from '@/utils/formatters';

interface MetricsData {
  balance: number;
  inflow: number;
  inflowAmount: number;
}

interface WalletMetricsGridProps {
  variations: MetricsData;
  averageInflow: number;
  projectedBalance: number;
  wallet: {
    saldo: number;
    total_entradas: number;
  };
  currency: 'BTC' | 'USD' | 'BRL';
  btcPrice: {
    usd: number;
    brl: number;
  };
}

export const WalletMetricsGrid: React.FC<WalletMetricsGridProps> = ({
  variations,
  averageInflow,
  projectedBalance,
  wallet,
  currency,
  btcPrice
}) => {
  const formatValue = (value: number) => {
    switch (currency) {
      case 'BTC':
        return formatBitcoinValue(value);
      case 'USD':
        return formatCurrency(value * btcPrice.usd, 'USD');
      case 'BRL':
        return formatCurrency(value * btcPrice.brl, 'BRL');
    }
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (variation < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getVariationColor = (variation: number) => {
    if (variation > 0) return "text-green-500";
    if (variation < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Variação do Saldo */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Variação do Saldo</p>
          {getVariationIcon(variations.balance)}
        </div>
        <div className={`flex items-baseline ${getVariationColor(variations.balance)}`}>
          <span className="text-xl font-bold">{formatPercentage(variations.balance)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Saldo atual: {formatValue(wallet.saldo)}
        </p>
      </div>
      
      {/* Variação de Entradas */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Var. de Recebimentos</p>
          {getVariationIcon(variations.inflow)}
        </div>
        <div className={`flex items-baseline ${getVariationColor(variations.inflow)}`}>
          <span className="text-xl font-bold">{formatPercentage(variations.inflow)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Total recebido: {formatValue(wallet.total_entradas)}
        </p>
      </div>
      
      {/* Média de Entradas */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Média por Semana</p>
          <BarChart3 className="h-4 w-4 text-satotrack-neon" />
        </div>
        <div className="flex items-baseline text-satotrack-neon">
          <span className="text-xl font-bold">{formatValue(averageInflow)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Recebimentos semanais
        </p>
      </div>
      
      {/* Projeção de Saldo */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Saldo Projetado</p>
          <LineChart className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline text-cyan-400">
          <span className="text-xl font-bold">{formatValue(projectedBalance)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Projeção para fim do mês
        </p>
      </div>
    </div>
  );
};
