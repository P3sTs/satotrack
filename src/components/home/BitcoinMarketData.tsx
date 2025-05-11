
import React from 'react';
import BitcoinPriceCard from './BitcoinPriceCard';

interface BitcoinData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  last_updated: string;
}

interface BitcoinMarketDataProps {
  bitcoinData: BitcoinData;
}

const BitcoinMarketData = ({ bitcoinData }: BitcoinMarketDataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Preço em USD */}
      <BitcoinPriceCard
        title="Bitcoin (USD)"
        price={bitcoinData.price_usd}
        currency="USD"
        changePercentage={bitcoinData.price_change_percentage_24h}
      />
      
      {/* Preço em BRL */}
      <BitcoinPriceCard
        title="Bitcoin (BRL)"
        price={bitcoinData.price_brl}
        currency="BRL"
        changePercentage={bitcoinData.price_change_percentage_24h}
      />
      
      {/* Market Cap */}
      <BitcoinPriceCard
        title="Capitalização"
        price={bitcoinData.market_cap_usd}
        currency="USD"
        showChange={false}
        digits={0}
      />
      
      {/* Volume 24h */}
      <BitcoinPriceCard
        title="Volume 24h"
        price={bitcoinData.volume_24h_usd}
        currency="USD"
        showChange={false}
        digits={0}
      />
    </div>
  );
};

export default BitcoinMarketData;
