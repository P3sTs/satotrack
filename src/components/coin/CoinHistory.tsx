import React from 'react';

interface CoinHistoryProps {
  symbol: string;
}

export const CoinHistory: React.FC<CoinHistoryProps> = ({ symbol }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Histórico de {symbol} em desenvolvimento</p>
    </div>
  );
};