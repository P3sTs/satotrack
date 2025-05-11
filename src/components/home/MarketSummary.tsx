
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import MarketTrendAlerts from './MarketTrendAlerts';
import BitcoinHeader from './BitcoinHeader';
import BitcoinChartGrid from './BitcoinChartGrid';
import MarketDataCards from './MarketDataCards';
import { LoadingState, ErrorState } from './LoadingStates';

interface MarketSummaryProps {
  isLoading: boolean;
  isRefreshing: boolean;
  bitcoinData: BitcoinPriceData | null;
  previousPrice: number | null;
  onRefresh: () => void;
}

const MarketSummary = ({ 
  isLoading, 
  isRefreshing, 
  bitcoinData, 
  previousPrice,
  onRefresh 
}: MarketSummaryProps) => {
  return (
    <section className="container px-4 md:px-6 py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-orbitron satotrack-gradient-text">Mercado Bitcoin</h2>
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2 border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon/10"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {bitcoinData && <MarketTrendAlerts bitcoinData={bitcoinData} />}
      
      <LoadingState isLoading={isLoading} />
      
      {!isLoading && bitcoinData ? (
        <>
          <BitcoinHeader bitcoinData={bitcoinData} />
          <BitcoinChartGrid 
            bitcoinData={bitcoinData} 
            previousPrice={previousPrice}
          />
          <MarketDataCards bitcoinData={bitcoinData} />
        </>
      ) : !isLoading ? (
        <ErrorState />
      ) : null}
    </section>
  );
};

export default MarketSummary;
