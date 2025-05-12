
import React from 'react';
import { formatDateTime, formatCurrencyValue, formatBRL } from '../utils/ChartFormatters';

const PriceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const timestamp = data.timestamp;
    const price = data.price;
    
    // Calculate BRL price (for demonstration purposes)
    const exchangeRate = 5.05; // Example BRL to USD rate
    const priceBRL = price * exchangeRate;

    return (
      <div className="bg-dashboard-dark/90 backdrop-blur-sm border border-satotrack-neon/20 p-3 rounded-lg shadow-lg">
        <div className="font-medium text-white mb-1.5">
          {formatDateTime(timestamp)}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Preço USD:</span>
            <span className="font-medium text-bitcoin">{formatCurrencyValue(price)}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Preço BRL:</span>
            <span className="font-medium text-bitcoin">{formatBRL(priceBRL)}</span>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default PriceTooltip;
