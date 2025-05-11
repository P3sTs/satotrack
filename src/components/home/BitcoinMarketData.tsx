
import React from 'react';
import BitcoinPriceCard from './BitcoinPriceCard';
import { formatarData } from '@/utils/formatters';

interface BitcoinData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  last_updated: string;
  market_trend?: 'bullish' | 'bearish' | 'neutral';
}

interface BitcoinMarketDataProps {
  bitcoinData: BitcoinData;
  lastSuccessUpdate?: Date | null;
}

const BitcoinMarketData = ({ bitcoinData, lastSuccessUpdate }: BitcoinMarketDataProps) => {
  const updateTimeToShow = lastSuccessUpdate ? formatarData(lastSuccessUpdate.toISOString()) : formatarData(bitcoinData.last_updated);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-bitcoin p-2 rounded-full">
            <img 
              src="/bitcoin-logo.svg" 
              alt="Bitcoin" 
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.src = 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg';
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Bitcoin</h2>
            <p className="text-sm text-muted-foreground flex items-center">
              <span>Atualizado: {updateTimeToShow}</span>
              {lastSuccessUpdate && Date.now() - lastSuccessUpdate.getTime() > 120000 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  Desatualizado
                </span>
              )}
            </p>
          </div>
        </div>
        <div className={`text-sm font-semibold px-2.5 py-1 rounded-full ${bitcoinData.price_change_percentage_24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {bitcoinData.price_change_percentage_24h >= 0 ? '+' : ''}
          {bitcoinData.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>
      
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
    </div>
  );
};

export default BitcoinMarketData;
