import React from 'react';

interface CoinData {
  name: string;
  symbol: string;
  network?: string;
}

interface CoinAboutProps {
  coinData: CoinData;
}

export const CoinAbout: React.FC<CoinAboutProps> = ({ coinData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sobre {coinData.name}</h3>
      <p className="text-muted-foreground">
        {coinData.name} ({coinData.symbol}) é uma criptomoeda {coinData.network && `na rede ${coinData.network}`}.
      </p>
    </div>
  );
};