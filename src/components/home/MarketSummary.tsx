
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BitcoinMarketData from './BitcoinMarketData';
import BitcoinCharts from './BitcoinCharts';
import { LoadingStates } from './LoadingStates';
import { RefreshCw } from 'lucide-react';

interface MarketSummaryProps {
  bitcoinData: any;
  previousPrice: number | null;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastSuccessUpdate?: Date | null;
}

const MarketSummary = ({ 
  bitcoinData, 
  previousPrice,
  isLoading, 
  isRefreshing,
  onRefresh,
  lastSuccessUpdate
}: MarketSummaryProps) => {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-orbitron mb-2 md:mb-0">Mercado Bitcoin</h2>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
      </div>

      <Card className="p-6 mb-8">
        {isLoading ? (
          <LoadingStates />
        ) : bitcoinData ? (
          <BitcoinMarketData 
            bitcoinData={bitcoinData} 
            lastSuccessUpdate={lastSuccessUpdate}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Não foi possível carregar os dados do mercado</p>
          </div>
        )}
      </Card>

      <BitcoinCharts bitcoinData={bitcoinData} previousPrice={previousPrice} />
    </section>
  );
};

export default MarketSummary;
