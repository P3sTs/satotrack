
import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface MarketDataCardsProps {
  bitcoinData: BitcoinPriceData;
}

const MarketDataCards = ({ bitcoinData }: MarketDataCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <Card className="cyberpunk-card border-none shadow-md">
        <CardContent className="pt-6 pb-6">
          <p className="text-sm font-medium text-satotrack-text mb-1">
            Capitalização de Mercado
          </p>
          <p className="text-2xl font-bold font-orbitron text-satotrack-neon">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              compactDisplay: 'short',
            }).format(bitcoinData.market_cap_usd)}
          </p>
        </CardContent>
      </Card>

      <Card className="cyberpunk-card border-none shadow-md">
        <CardContent className="pt-6 pb-6">
          <p className="text-sm font-medium text-satotrack-text mb-1">
            Variação 24h
          </p>
          <div className={`flex items-center text-2xl font-bold font-orbitron ${
            bitcoinData.price_change_percentage_24h >= 0 ? 'text-satotrack-neon' : 'text-satotrack-alert'
          }`}>
            {bitcoinData.price_change_percentage_24h >= 0 ? (
              <TrendingUp className="mr-1 h-5 w-5" />
            ) : (
              <TrendingDown className="mr-1 h-5 w-5" />
            )}
            {bitcoinData.price_change_percentage_24h >= 0 ? '+' : ''}
            {bitcoinData.price_change_percentage_24h.toFixed(2)}%
          </div>
        </CardContent>
      </Card>

      <Card className="cyberpunk-card border-none shadow-md">
        <CardContent className="pt-6 pb-6">
          <p className="text-sm font-medium text-satotrack-text mb-1">
            Tendência
          </p>
          <div className={`text-lg font-semibold font-orbitron ${
            bitcoinData.market_trend === 'bullish' ? 'text-satotrack-neon' : 
            bitcoinData.market_trend === 'bearish' ? 'text-satotrack-alert' : 
            'text-yellow-500'
          }`}>
            {bitcoinData.market_trend === 'bullish' && (
              <span className="flex items-center">
                <TrendingUp className="mr-1 h-5 w-5" />
                Mercado em Alta
              </span>
            )}
            {bitcoinData.market_trend === 'bearish' && (
              <span className="flex items-center">
                <TrendingDown className="mr-1 h-5 w-5" />
                Mercado em Baixa
              </span>
            )}
            {bitcoinData.market_trend === 'neutral' && (
              <span className="flex items-center">
                <AlertCircle className="mr-1 h-5 w-5" />
                Mercado Neutro
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="cyberpunk-card border-none shadow-md">
        <CardContent className="pt-6 pb-6 flex flex-col justify-between h-full">
          <p className="text-sm font-medium text-satotrack-text mb-1">
            Informações
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm">Atualização:</span>
            <span className="text-sm font-medium text-satotrack-neon">a cada 10s</span>
          </div>
          {bitcoinData.last_updated && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Última:</span>
              <span className="text-sm font-medium text-white">
                {new Date(bitcoinData.last_updated).toLocaleTimeString('pt-BR')}
              </span>
            </div>
          )}
          <div className="flex items-center justify-end mt-2">
            <span className="text-xs text-satotrack-text flex items-center">
              <Eye className="h-3 w-3 mr-1 text-satotrack-neon" /> Monitorando
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketDataCards;
