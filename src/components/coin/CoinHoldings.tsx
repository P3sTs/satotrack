import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface CoinData {
  symbol: string;
  balance?: number;
  balanceUSD?: number;
}

interface CoinHoldingsProps {
  coinData: CoinData;
  onSend: () => void;
  onReceive: () => void;
  onSwap: () => void;
  onBuy: () => void;
}

export const CoinHoldings: React.FC<CoinHoldingsProps> = ({ coinData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Meu saldo</h3>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {coinData.symbol.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{coinData.symbol}</p>
                <p className="text-sm text-muted-foreground">
                  {coinData.balance?.toFixed(6) || '0.000000'} {coinData.symbol}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold">{formatCurrency(coinData.balanceUSD || 0, 'BRL')}</p>
              <p className="text-sm text-red-500">-R$ 1,56</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};