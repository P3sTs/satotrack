
import React from 'react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import HeroBitcoinSection from '@/components/home/HeroBitcoinSection';
import MarketSummary from '@/components/home/MarketSummary';

const Home = () => {
  const { data: bitcoinData, previousPrice, isLoading, isRefreshing, refresh } = useBitcoinPrice();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeroBitcoinSection />
      <MarketSummary 
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        bitcoinData={bitcoinData}
        previousPrice={previousPrice}
        onRefresh={refresh}
      />
    </div>
  );
};

export default Home;
