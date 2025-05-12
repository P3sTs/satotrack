
import React from 'react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { usePriceChartData } from '@/hooks/usePriceChartData';
import PriceAreaChart from './price/PriceAreaChart';

interface PriceChartProps {
  bitcoinData: BitcoinPriceData | null | undefined;
  timeRange: '7D' | '30D' | '6M' | '1Y';
}

const PriceChart: React.FC<PriceChartProps> = ({ bitcoinData, timeRange }) => {
  const { chartData, isLoading } = usePriceChartData(bitcoinData, timeRange);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-60">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bitcoin"></div>
      </div>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-60">
        <p className="text-muted-foreground">Dados não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="w-full h-60 md:h-72 animate-fade-in">
      <PriceAreaChart data={chartData} timeRange={timeRange} />
    </div>
  );
};

export default PriceChart;
