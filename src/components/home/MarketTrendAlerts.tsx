
import React from 'react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { TrendingUp, TrendingDown, AlertTriangle, Volume2 } from 'lucide-react';

interface MarketTrendAlertsProps {
  bitcoinData: BitcoinPriceData;
}

const MarketTrendAlerts: React.FC<MarketTrendAlertsProps> = ({ bitcoinData }) => {
  // Generate dynamic alerts based on market data
  const getAlerts = () => {
    const alerts = [];
    
    // Price change alert
    if (Math.abs(bitcoinData.price_change_percentage_24h) >= 3) {
      const isPositive = bitcoinData.price_change_percentage_24h > 0;
      alerts.push({
        icon: isPositive ? TrendingUp : TrendingDown,
        text: `${isPositive ? 'Alta' : 'Queda'} de ${Math.abs(bitcoinData.price_change_percentage_24h).toFixed(1)}% nas últimas 24h`,
        color: isPositive ? 'green' : 'red',
      });
    }
    
    // Volume alert - high volume day
    if (bitcoinData.volume_24h > 20000000000) { // $20 billion threshold
      alerts.push({
        icon: Volume2,
        text: 'Volume de negociação elevado nas últimas 24h',
        color: 'blue',
      });
    }
    
    // Market trend alert
    if (bitcoinData.market_trend) {
      alerts.push({
        icon: bitcoinData.market_trend === 'bullish' ? TrendingUp : TrendingDown,
        text: bitcoinData.market_trend === 'bullish' 
              ? 'Tendência de mercado altista' 
              : 'Tendência de mercado baixista',
        color: bitcoinData.market_trend === 'bullish' ? 'green' : 'red',
      });
    }
    
    return alerts;
  };
  
  const alerts = getAlerts();
  
  if (alerts.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      {alerts.map((alert, index) => {
        const Icon = alert.icon;
        const bgColorClass = alert.color === 'green' ? 'bg-green-500/10' :
                             alert.color === 'red' ? 'bg-red-500/10' : 
                             'bg-blue-500/10';
                             
        const textColorClass = alert.color === 'green' ? 'text-green-500' :
                             alert.color === 'red' ? 'text-red-500' : 
                             'text-blue-500';
                             
        const borderColorClass = alert.color === 'green' ? 'border-green-500/30' :
                               alert.color === 'red' ? 'border-red-500/30' : 
                               'border-blue-500/30';
        
        return (
          <div 
            key={index} 
            className={`flex items-center gap-3 p-3 rounded-lg border ${borderColorClass} ${bgColorClass}`}
          >
            <Icon className={`h-5 w-5 ${textColorClass}`} />
            <span className={`text-sm font-medium ${textColorClass}`}>{alert.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MarketTrendAlerts;
