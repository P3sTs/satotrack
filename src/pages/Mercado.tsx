
import React, { useState } from 'react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { Button } from '@/components/ui/button';
import MarketTrendAlerts from '@/components/home/MarketTrendAlerts';
import MarketHeader from '@/components/market/MarketHeader';
import PriceCards from '@/components/market/PriceCards';
import AdvancedTools from '@/components/market/AdvancedTools';
import MarketTabs from '@/components/market/MarketTabs';
import MarketInfo from '@/components/market/MarketInfo';

const Mercado = () => {
  const { data: bitcoinData, isLoading, isRefreshing, refresh } = useBitcoinPrice();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-700 rounded"></div>
          <div className="h-10 w-32 bg-gray-700 rounded"></div>
        </div>
        <div className="h-32 bg-gray-700 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
        <div className="h-96 bg-gray-700 rounded"></div>
      </div>
    );
  }
  
  if (!bitcoinData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados do mercado</h2>
          <p className="text-gray-400 mb-4">Não foi possível obter as informações do Bitcoin no momento.</p>
          <Button variant="default" onClick={refresh}>Tentar novamente</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <MarketHeader isRefreshing={isRefreshing} onRefresh={refresh} />
      
      <MarketTrendAlerts bitcoinData={bitcoinData} />
      
      <PriceCards bitcoinData={bitcoinData} />

      <AdvancedTools />
      
      <MarketTabs 
        bitcoinData={bitcoinData} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <MarketInfo />
    </div>
  );
};

export default Mercado;
