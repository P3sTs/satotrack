
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import OverviewTab from './tabs/OverviewTab';
import RealtimeTab from './tabs/RealtimeTab';
import HistoricalTab from './tabs/HistoricalTab';
import AnalysisTab from './tabs/AnalysisTab';

interface MarketTabsProps {
  bitcoinData: BitcoinPriceData;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const MarketTabs: React.FC<MarketTabsProps> = ({ bitcoinData, activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full mb-6">
      <TabsList className="mb-4 overflow-x-auto flex-nowrap">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
        <TabsTrigger value="historical">Histórico</TabsTrigger>
        <TabsTrigger value="analysis">Análise Avançada</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-0">
        <OverviewTab bitcoinData={bitcoinData} />
      </TabsContent>
      
      <TabsContent value="realtime" className="mt-0">
        <RealtimeTab />
      </TabsContent>
      
      <TabsContent value="historical" className="mt-0">
        <HistoricalTab bitcoinData={bitcoinData} />
      </TabsContent>
      
      <TabsContent value="analysis" className="mt-0">
        <AnalysisTab bitcoinData={bitcoinData} />
      </TabsContent>
    </Tabs>
  );
};

export default MarketTabs;
