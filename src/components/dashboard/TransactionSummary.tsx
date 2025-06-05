
import React from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { formatCurrency } from '@/utils/formatters';
import { PieChart } from 'lucide-react';

interface TransactionSummaryProps {
  carteiras: CarteiraBTC[];
  bitcoinData?: BitcoinPriceData | null;
  currency: 'BRL' | 'USD';
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  carteiras,
  bitcoinData,
  currency
}) => {
  if (!bitcoinData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted-foreground">Carregando dados...</div>
      </div>
    );
  }

  const currentPrice = currency === 'BRL' ? bitcoinData.price_brl : bitcoinData.price_usd;
  
  const totalBalance = carteiras.reduce((sum, wallet) => sum + wallet.saldo, 0);
  const totalReceived = carteiras.reduce((sum, wallet) => sum + wallet.total_entradas, 0);
  const totalSent = carteiras.reduce((sum, wallet) => sum + wallet.total_saidas, 0);
  
  const balanceValue = totalBalance * currentPrice;
  const receivedValue = totalReceived * currentPrice;
  const sentValue = totalSent * currentPrice;
  
  const total = balanceValue + sentValue;
  
  const data = [
    {
      name: 'Saldo Atual',
      value: balanceValue,
      percentage: total > 0 ? (balanceValue / total) * 100 : 0,
      color: 'bg-bitcoin'
    },
    {
      name: 'Total Enviado',
      value: sentValue,
      percentage: total > 0 ? (sentValue / total) * 100 : 0,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Pie chart simulation */}
      <div className="relative h-48 mx-auto w-48">
        <div className="absolute inset-0 rounded-full bg-bitcoin"></div>
        <div 
          className="absolute inset-0 rounded-full bg-red-500"
          style={{
            background: `conic-gradient(#f59e0b 0deg ${data[0].percentage * 3.6}deg, #ef4444 ${data[0].percentage * 3.6}deg 360deg)`
          }}
        ></div>
        <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
          <div className="text-center">
            <PieChart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm font-medium">Distribuição</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded ${item.color}`}></div>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">
                {formatCurrency(item.value, currency)}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <div className="text-sm text-muted-foreground">Total Movimentado</div>
          <div className="text-lg font-bold">
            {formatCurrency(receivedValue, currency)}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Carteiras Ativas</div>
          <div className="text-lg font-bold">
            {carteiras.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
