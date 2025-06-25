
import React from 'react';
import { formatBitcoinValue, formatCurrency } from '@/utils/formatters';

interface WalletMetricsSummaryProps {
  wallet: {
    saldo: number;
    total_entradas: number;
  };
  bitcoinData?: {
    price_brl: number;
  } | null;
  variations: {
    inflow: number;
    inflowAmount: number;
  };
  timeRange: '7d' | '30d' | '90d';
  isUpdating: boolean;
  walletId: string;
}

export const WalletMetricsSummary: React.FC<WalletMetricsSummaryProps> = ({
  wallet,
  bitcoinData,
  variations,
  timeRange,
  isUpdating,
  walletId
}) => {
  return (
    <div className="pt-2 border-t border-border mt-4">
      <p className="text-sm text-muted-foreground">
        <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-1"></span>
        Saldo atualizado automaticamente 
        {isUpdating ? '...' : '🟢'}
      </p>
      <p className="text-sm">
        Recebimentos totais: {formatBitcoinValue(wallet.total_entradas)} 
        {bitcoinData && ` (${formatCurrency(wallet.total_entradas * bitcoinData.price_brl, 'BRL')})`}
      </p>
      {variations.inflow > 0 && (
        <p className="text-sm text-green-500">
          Você recebeu {formatBitcoinValue(variations.inflowAmount)} nos últimos {
            timeRange === '7d' ? '7 dias' : 
            timeRange === '30d' ? '30 dias' : '90 dias'
          }
        </p>
      )}
    </div>
  );
};
