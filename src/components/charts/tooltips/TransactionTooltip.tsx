
import React from 'react';
import { formatDateTime, formatBitcoinValue, formatCurrencyValue, formatBRL } from '../utils/ChartFormatters';

const TransactionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const timestamp = data.timestamp;
    const amount = data.amount;
    const type = data.type;
    
    // Calculate USD and BRL values (for demonstration)
    const bitcoinPrice = 65000; // Example BTC price in USD
    const amountUSD = amount * bitcoinPrice;
    const exchangeRate = 5.05; // Example BRL to USD rate
    const amountBRL = amountUSD * exchangeRate;

    const isReceived = type === 'received';

    return (
      <div className="bg-dashboard-dark/90 backdrop-blur-sm border border-satotrack-neon/20 p-3 rounded-lg shadow-lg">
        <div className="font-medium text-white mb-1.5">
          {formatDateTime(timestamp)}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Tipo:</span>
            <span className={isReceived ? "font-medium text-green-500" : "font-medium text-red-500"}>
              {isReceived ? 'Recebido' : 'Enviado'}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Valor BTC:</span>
            <span className={isReceived ? "font-medium text-green-500" : "font-medium text-red-500"}>
              {isReceived ? '+' : '-'}{formatBitcoinValue(Math.abs(amount))} BTC
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Valor USD:</span>
            <span className="font-medium">
              {isReceived ? '+' : '-'}{formatCurrencyValue(Math.abs(amountUSD))}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Valor BRL:</span>
            <span className="font-medium">
              {isReceived ? '+' : '-'}{formatBRL(Math.abs(amountBRL))}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default TransactionTooltip;
