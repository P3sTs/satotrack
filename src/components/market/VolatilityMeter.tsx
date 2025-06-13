
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp } from 'lucide-react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

const VolatilityMeter: React.FC = () => {
  const { data: bitcoinData } = useBitcoinPrice();

  const calculateVolatility = () => {
    if (!bitcoinData?.price_change_percentage_24h) return { level: 'Baixa', percentage: 0, color: 'green' };
    
    const absChange = Math.abs(bitcoinData.price_change_percentage_24h);
    
    if (absChange > 10) {
      return { level: 'Muito Alta', percentage: Math.min(absChange, 20) * 5, color: 'red' };
    } else if (absChange > 5) {
      return { level: 'Alta', percentage: absChange * 10, color: 'orange' };
    } else if (absChange > 2) {
      return { level: 'Média', percentage: absChange * 20, color: 'yellow' };
    } else {
      return { level: 'Baixa', percentage: absChange * 50, color: 'green' };
    }
  };

  const volatility = calculateVolatility();

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'from-red-500 to-red-600 text-red-100';
      case 'orange':
        return 'from-orange-500 to-orange-600 text-orange-100';
      case 'yellow':
        return 'from-yellow-500 to-yellow-600 text-yellow-100';
      case 'green':
        return 'from-green-500 to-green-600 text-green-100';
      default:
        return 'from-gray-500 to-gray-600 text-gray-100';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-500';
      case 'orange':
        return 'text-orange-500';
      case 'yellow':
        return 'text-yellow-500';
      case 'green':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="cyberpunk-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-satotrack-neon" />
          📊 Indicador de Volatilidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getTextColor(volatility.color)}`}>
            {volatility.level}
          </div>
          <div className="text-sm text-muted-foreground">
            Baseado nas últimas 24h
          </div>
        </div>

        {/* Termômetro Visual */}
        <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getColorClasses(volatility.color)} transition-all duration-1000 ease-out rounded-full flex items-center justify-end pr-2`}
            style={{ width: `${Math.max(volatility.percentage, 5)}%` }}
          >
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        {/* Escala de referência */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>Baixa</span>
          <span>Média</span>
          <span>Alta</span>
          <span>20%+</span>
        </div>

        {bitcoinData && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Variação 24h:</span>
              <span className={`font-bold ${bitcoinData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {bitcoinData.price_change_percentage_24h >= 0 ? '+' : ''}
                {bitcoinData.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Volume 24h:</span>
              <span className="font-medium text-sm">
                ${(bitcoinData.volume_24h_usd || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          * Volatilidade calculada com base na variação percentual de preço
        </div>
      </CardContent>
    </Card>
  );
};

export default VolatilityMeter;
