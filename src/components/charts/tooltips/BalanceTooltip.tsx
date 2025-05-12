
import React from 'react';
import { formatDateTime, formatBitcoinValue, formatCurrencyValue, formatBRL } from '../utils/ChartFormatters';

const BalanceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const timestamp = data.timestamp;
    const balance = data.balance;
    
    // Calculate USD and BRL values (for demonstration)
    const bitcoinPrice = 65000; // Example BTC price in USD
    const balanceUSD = balance * bitcoinPrice;
    const exchangeRate = 5.05; // Example BRL to USD rate
    const balanceBRL = balanceUSD * exchangeRate;

    return (
      <div className="bg-dashboard-dark/90 backdrop-blur-sm border border-satotrack-neon/20 p-3 rounded-lg shadow-lg">
        <div className="font-medium text-white mb-1.5">
          {formatDateTime(timestamp)}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Saldo BTC:</span>
            <span className="font-medium text-satotrack-neon">{formatBitcoinValue(balance)} BTC</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Valor USD:</span>
            <span className="font-medium">{formatCurrencyValue(balanceUSD)}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Valor BRL:</span>
            <span className="font-medium">{formatBRL(balanceBRL)}</span>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default BalanceTooltip;
