
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BitcoinMarketData from './BitcoinMarketData';
import BitcoinCharts from './BitcoinCharts';

interface BitcoinData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  last_updated: string;
}

interface MarketSectionProps {
  isLoading: boolean;
  isRefreshing: boolean;
  bitcoinData: BitcoinData | null;
  onRefresh: () => void;
}

const MarketSection = ({ 
  isLoading, 
  isRefreshing, 
  bitcoinData, 
  onRefresh 
}: MarketSectionProps) => {
  return (
    <section className="container px-4 md:px-6 py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Mercado Bitcoin</h2>
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Atualizar mercado
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bitcoin"></div>
        </div>
      ) : bitcoinData ? (
        <>
          <BitcoinMarketData bitcoinData={bitcoinData} />
          <BitcoinCharts />
        </>
      ) : (
        <Card className="bitcoin-card">
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Não foi possível carregar os dados do Bitcoin</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default MarketSection;
