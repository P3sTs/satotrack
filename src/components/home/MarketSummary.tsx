
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import MarketTrendAlerts from './MarketTrendAlerts';
import BitcoinHeader from './BitcoinHeader';
import BitcoinChartGrid from './BitcoinChartGrid';
import MarketDataCards from './MarketDataCards';
import { LoadingState, ErrorState } from './LoadingStates';
import InteractiveChart from '../charts/InteractiveChart';

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
    <section className="container px-4 md:px-6 py-6 md:py-8 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 md:mb-8">
        <h2 className="text-xl md:text-3xl font-orbitron satotrack-gradient-text">Mercado Bitcoin</h2>
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2 border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon/10 self-end sm:self-auto"
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
          
          <div className="my-6 md:my-8">
            <InteractiveChart bitcoinData={bitcoinData} />
          </div>
          
          <div className="overflow-x-hidden">
            <BitcoinChartGrid 
              bitcoinData={bitcoinData} 
              previousPrice={previousPrice}
            />
          </div>
          <div className="overflow-x-hidden">
            <MarketDataCards bitcoinData={bitcoinData} />
          </div>
        </>
      ) : !isLoading ? (
        <ErrorState />
      ) : null}
    </section>
  );
};

export default MarketSummary;
