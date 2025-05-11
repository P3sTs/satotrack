
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BitcoinPriceChart from '@/components/BitcoinPriceChart';
import MarketDistributionChart from '@/components/MarketDistributionChart';

const BitcoinCharts = () => {
  const [activeTab, setActiveTab] = useState("price");
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="bitcoin-card col-span-1 lg:col-span-2 border-none shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gráfico BTCUSD</CardTitle>
            <Tabs defaultValue="price" value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="price">Preço</TabsTrigger>
                <TabsTrigger value="market">Mercado</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            {activeTab === "price" ? 
              "Evolução do preço em USD (últimos 7 dias)" : 
              "Valor de mercado em USD"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <BitcoinPriceChart />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bitcoin-card border-none shadow-md">
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
