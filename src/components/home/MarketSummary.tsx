
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import MarketTrendAlerts from './MarketTrendAlerts';
import BitcoinHeader from './BitcoinHeader';
import MarketDataCards from './MarketDataCards';

interface MarketSummaryProps {
  isLoading: boolean;
  isRefreshing: boolean;
  bitcoinData: BitcoinPriceData | null;
  previousPrice: number | null;
  onRefresh: () => void;
}

const LoadingState = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <div className="relative h-12 w-12 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-t-satotrack-neon border-x-transparent border-b-transparent animate-spin"></div>
        </div>
        <p className="text-satotrack-text">Carregando dados do mercado...</p>
      </div>
    </div>
  );
};

const ErrorState = () => (
  <div className="text-center py-12">
    <div className="bg-dashboard-medium/50 border border-red-500/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-red-400 mb-2">Erro ao carregar dados</h3>
      <p className="text-satotrack-text">
        Não foi possível carregar os dados do Bitcoin. Tente novamente em alguns instantes.
      </p>
    </div>
  </div>
);

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

      {/* Alertas de Tendência */}
      {bitcoinData && <MarketTrendAlerts bitcoinData={bitcoinData} />}
      
      {/* Loading State */}
      <LoadingState isLoading={isLoading} />
      
      {/* Content */}
      {!isLoading && bitcoinData ? (
        <>
          <BitcoinHeader bitcoinData={bitcoinData} />
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
