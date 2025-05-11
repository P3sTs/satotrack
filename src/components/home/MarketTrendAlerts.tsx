
import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface MarketTrendAlertsProps {
  bitcoinData: BitcoinPriceData;
}

const MarketTrendAlerts = ({ bitcoinData }: MarketTrendAlertsProps) => {
  if (!bitcoinData) return null;
  
  return (
    <>
      {bitcoinData.market_trend === 'bullish' && (
        <div className="bg-gradient-to-r from-satotrack-neon/10 to-transparent border border-satotrack-neon/20 rounded-lg p-4 flex items-center gap-3 mb-6 backdrop-blur-sm">
          <div className="p-2 rounded-full bg-satotrack-neon/20">
            <TrendingUp className="h-5 w-5 text-satotrack-neon" />
          </div>
          <div>
            <h4 className="text-satotrack-neon font-medium">Mercado em Alta</h4>
            <p className="text-satotrack-text text-sm">
              O Bitcoin está em tendência de alta com variação positiva significativa nas últimas 24h.
            </p>
          </div>
        </div>
      )}

      {bitcoinData.market_trend === 'bearish' && (
        <div className="bg-gradient-to-r from-satotrack-alert/10 to-transparent border border-satotrack-alert/20 rounded-lg p-4 flex items-center gap-3 mb-6 backdrop-blur-sm">
          <div className="p-2 rounded-full bg-satotrack-alert/20">
            <TrendingDown className="h-5 w-5 text-satotrack-alert" />
          </div>
          <div>
            <h4 className="text-satotrack-alert font-medium">Mercado em Baixa</h4>
            <p className="text-satotrack-text text-sm">
              O Bitcoin está em tendência de queda com variação negativa significativa nas últimas 24h.
            </p>
          </div>
        </div>
      )}
      
      {bitcoinData.market_trend === 'neutral' && (
        <div className="bg-gradient-to-r from-gray-500/10 to-transparent border border-gray-500/20 rounded-lg p-4 flex items-center gap-3 mb-6 backdrop-blur-sm">
          <div className="p-2 rounded-full bg-gray-500/20">
            <AlertTriangle className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <h4 className="text-gray-400 font-medium">Mercado Estável</h4>
            <p className="text-satotrack-text text-sm">
              O Bitcoin está em período de estabilidade sem variações significativas nas últimas 24h.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketTrendAlerts;
