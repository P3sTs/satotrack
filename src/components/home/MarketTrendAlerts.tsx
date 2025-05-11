
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface MarketTrendAlertsProps {
  bitcoinData: BitcoinPriceData;
}

const MarketTrendAlerts = ({ bitcoinData }: MarketTrendAlertsProps) => {
  if (!bitcoinData) return null;
  
  return (
    <>
      {bitcoinData.market_trend === 'bullish' && (
        <div className="bg-satotrack-neon/5 border border-satotrack-neon/20 rounded-lg p-4 flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-satotrack-neon" />
          <p className="text-satotrack-neon">
            <strong>Mercado em Alta:</strong> O Bitcoin está em tendência de alta com variação positiva significativa nas últimas 24h.
          </p>
        </div>
      )}

      {bitcoinData.market_trend === 'bearish' && (
        <div className="bg-satotrack-alert/5 border border-satotrack-alert/20 rounded-lg p-4 flex items-center gap-3 mb-6">
          <TrendingDown className="h-5 w-5 text-satotrack-alert" />
          <p className="text-satotrack-alert">
            <strong>Mercado em Baixa:</strong> O Bitcoin está em tendência de queda com variação negativa significativa nas últimas 24h.
          </p>
        </div>
      )}
    </>
  );
};

export default MarketTrendAlerts;
