
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BitcoinPriceChart from '@/components/BitcoinPriceChart';
import MarketDistributionChart from '@/components/MarketDistributionChart';

const BitcoinCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="bitcoin-card col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Preço do Bitcoin (últimos 7 dias)</CardTitle>
          <CardDescription>
            Evolução do preço em USD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <BitcoinPriceChart />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bitcoin-card">
        <CardHeader>
          <CardTitle>Distribuição de Mercado</CardTitle>
          <CardDescription>
            Dominância por capitalização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <MarketDistributionChart />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BitcoinCharts;
