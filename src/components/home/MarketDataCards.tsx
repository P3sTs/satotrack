
import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Eye, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface MarketDataCardsProps {
  bitcoinData: BitcoinPriceData;
}

const MarketDataCards = ({ bitcoinData }: MarketDataCardsProps) => {
  const formatCurrency = (value: number, currency: 'USD' | 'BRL' = 'USD') => {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'pt-BR', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Capitalização de Mercado */}
      <Card className="bg-dashboard-medium/30 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-satotrack-text">
              Market Cap
            </p>
            <BarChart3 className="h-4 w-4 text-satotrack-neon" />
          </div>
          <p className="text-2xl font-bold font-orbitron text-white">
            {formatCurrency(bitcoinData.market_cap)}
          </p>
        </CardContent>
      </Card>

      {/* Volume 24h */}
      <Card className="bg-dashboard-medium/30 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-satotrack-text">
              Volume 24h
            </p>
            <DollarSign className="h-4 w-4 text-satotrack-neon" />
          </div>
          <p className="text-2xl font-bold font-orbitron text-white">
            {formatCurrency(bitcoinData.volume_24h)}
          </p>
        </CardContent>
      </Card>

      {/* Tendência do Mercado */}
      <Card className="bg-dashboard-medium/30 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-satotrack-text">
              Tendência
            </p>
            {bitcoinData.market_trend === 'bullish' && <TrendingUp className="h-4 w-4 text-green-400" />}
            {bitcoinData.market_trend === 'bearish' && <TrendingDown className="h-4 w-4 text-red-400" />}
            {bitcoinData.market_trend === 'neutral' && <AlertCircle className="h-4 w-4 text-yellow-400" />}
          </div>
          <p className={`text-lg font-semibold font-orbitron ${
            bitcoinData.market_trend === 'bullish' ? 'text-green-400' : 
            bitcoinData.market_trend === 'bearish' ? 'text-red-400' : 
            'text-yellow-400'
          }`}>
            {bitcoinData.market_trend === 'bullish' && 'Alta'}
            {bitcoinData.market_trend === 'bearish' && 'Baixa'}
            {bitcoinData.market_trend === 'neutral' && 'Neutro'}
          </p>
        </CardContent>
      </Card>

      {/* Status do Sistema */}
      <Card className="bg-dashboard-medium/30 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-satotrack-text">
              Status
            </p>
            <Eye className="h-4 w-4 text-satotrack-neon" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Última atualização:</span>
              <span className="font-medium text-satotrack-neon">
                {new Date(bitcoinData.last_updated).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center text-xs text-satotrack-text">
              <span className="inline-block h-2 w-2 rounded-full bg-satotrack-neon mr-2 animate-pulse"></span>
              Monitoramento ativo
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketDataCards;
