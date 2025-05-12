
import React from 'react';
import { formatDateTime, formatBitcoinValue, formatCurrencyValue, formatBRL } from '../utils/ChartFormatters';

const TransactionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const timestamp = data.timestamp;
    const valor = data.valor;
    const tipo = data.tipo;
    
    // Calculate USD and BRL values (for demonstration)
    const bitcoinPrice = 65000; // Example BTC price in USD
    const valorUSD = valor * bitcoinPrice;
    const exchangeRate = 5.05; // Example BRL to USD rate
    const valorBRL = valorUSD * exchangeRate;

    const isEntrada = tipo === 'entrada';

    return (
      <div className="bg-dashboard-dark/90 backdrop-blur-sm border border-satotrack-neon/20 p-3 rounded-lg shadow-lg">
        <div className="font-medium text-white mb-1.5">
          {formatDateTime(timestamp)}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Tipo:</span>
            <span className={isEntrada ? "font-medium text-green-500" : "font-medium text-red-500"}>
              {isEntrada ? 'Recebido' : 'Enviado'}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Valor BTC:</span>
            <span className={isEntrada ? "font-medium text-green-500" : "font-medium text-red-500"}>
              {isEntrada ? '+' : '-'}{formatBitcoinValue(Math.abs(valor))} BTC
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Valor USD:</span>
            <span className="font-medium">
              {isEntrada ? '+' : '-'}{formatCurrencyValue(Math.abs(valorUSD))}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground text-sm">Valor BRL:</span>
            <span className="font-medium">
              {isEntrada ? '+' : '-'}{formatBRL(Math.abs(valorBRL))}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default TransactionTooltip;

