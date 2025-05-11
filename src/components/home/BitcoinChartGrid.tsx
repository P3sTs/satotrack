
import React from 'react';
import BitcoinCandlestickChart from './BitcoinCandlestickChart';
import BitcoinPriceCard from './BitcoinPriceCard';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface BitcoinChartGridProps {
  bitcoinData: BitcoinPriceData;
  previousPrice: number | null;
}

const BitcoinChartGrid = ({ bitcoinData, previousPrice }: BitcoinChartGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <div className="col-span-1 lg:col-span-2">
        <div className="cyberpunk-card p-1">
          <BitcoinCandlestickChart 
            priceUSD={bitcoinData.price_usd}
            changePercentage={bitcoinData.price_change_percentage_24h}
          />
        </div>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        {/* Preço em USD */}
        <BitcoinPriceCard
          title="Bitcoin (USD)"
          price={bitcoinData.price_usd}
          previousPrice={previousPrice}
          currency="USD"
          changePercentage={bitcoinData.price_change_percentage_24h}
          animateChanges={true}
        />
        
        {/* Preço em BRL */}
        <BitcoinPriceCard
          title="Bitcoin (BRL)"
          price={bitcoinData.price_brl}
          currency="BRL"
          changePercentage={bitcoinData.price_change_percentage_24h}
          animateChanges={false}
        />
        
        {/* Volume 24h */}
        <BitcoinPriceCard
          title="Volume 24h"
          price={bitcoinData.volume_24h_usd}
          currency="USD"
          showChange={false}
          digits={0}
          animateChanges={false}
        />
      </div>
    </div>
  );
};

export default BitcoinChartGrid;
