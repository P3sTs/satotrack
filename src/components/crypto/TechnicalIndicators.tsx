
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechnicalIndicator } from '@/services/crypto/cryptoService';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicator;
  currentPrice: number;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({
  indicators,
  currentPrice
}) => {
  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-500';
    if (rsi < 30) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return 'Sobrecomprado';
    if (rsi < 30) return 'Sobrevendido';
    return 'Neutro';
  };

  const getMovingAverageSignal = (price: number, ma: number) => {
    if (price > ma * 1.02) return { icon: TrendingUp, color: 'text-green-500', text: 'Alta' };
    if (price < ma * 0.98) return { icon: TrendingDown, color: 'text-red-500', text: 'Baixa' };
    return { icon: Minus, color: 'text-yellow-500', text: 'Neutro' };
  };

  const sma20Signal = getMovingAverageSignal(currentPrice, indicators.sma_20);
  const sma50Signal = getMovingAverageSignal(currentPrice, indicators.sma_50);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* RSI */}
      <Card className="bg-card/95 border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            RSI (14)
            <span className={`text-lg font-bold ${getRSIColor(indicators.rsi)}`}>
              {indicators.rsi.toFixed(1)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-xs">
            <span className={getRSIColor(indicators.rsi)}>
              {getRSIStatus(indicators.rsi)}
            </span>
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getRSIColor(indicators.rsi).replace('text-', 'bg-')}`}
                style={{ width: `${indicators.rsi}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Médias Móveis */}
      <Card className="bg-card/95 border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Médias Móveis</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>SMA 20</span>
            <div className="flex items-center gap-1">
              <sma20Signal.icon className={`h-3 w-3 ${sma20Signal.color}`} />
              <span className="font-medium">${indicators.sma_20.toFixed(0)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>SMA 50</span>
            <div className="flex items-center gap-1">
              <sma50Signal.icon className={`h-3 w-3 ${sma50Signal.color}`} />
              <span className="font-medium">${indicators.sma_50.toFixed(0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MACD */}
      <Card className="bg-card/95 border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">MACD</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-1">
          <div className="flex justify-between text-xs">
            <span>Linha</span>
            <span className="font-medium">{indicators.macd.line.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Sinal</span>
            <span className="font-medium">{indicators.macd.signal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Histograma</span>
            <span className={`font-medium ${indicators.macd.histogram > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {indicators.macd.histogram.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalIndicators;
