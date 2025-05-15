
import React, { useState } from 'react';
import { useBlockcypherData, CryptoCurrency } from '@/hooks/useBlockcypherData';
import CryptoCard from './CryptoCard';
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CryptoDashboardProps {
  refreshInterval?: number;
}

const currencies: CryptoCurrency[] = ['btc', 'ltc', 'dash', 'doge'];

const CryptoDashboard: React.FC<CryptoDashboardProps> = ({ refreshInterval = 60000 }) => {
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d'>('24h');
  
  // Initialize hooks for each cryptocurrency
  const btcData = useBlockcypherData('btc', refreshInterval);
  const ltcData = useBlockcypherData('ltc', refreshInterval);
  const dashData = useBlockcypherData('dash', refreshInterval);
  const dogeData = useBlockcypherData('doge', refreshInterval);
  
  const cryptoDataMap = {
    btc: btcData,
    ltc: ltcData,
    dash: dashData,
    doge: dogeData
  };
  
  const refreshAll = () => {
    btcData.refresh();
    ltcData.refresh();
    dashData.refresh();
    dogeData.refresh();
  };
  
  const isAnyRefreshing = btcData.isRefreshing || ltcData.isRefreshing || 
                          dashData.isRefreshing || dogeData.isRefreshing;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Cryptocurrency Network Status</h1>
        
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-muted-foreground mr-2">Período</span>
            <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="24h" className="text-xs">24h</TabsTrigger>
                <TabsTrigger value="7d" className="text-xs">7 dias</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs">30 dias</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Button
            variant="outline" 
            size="sm"
            onClick={refreshAll}
            disabled={isAnyRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isAnyRefreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar tudo</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {currencies.map((currency) => {
          const { data, isLoading, error, lastUpdated, isRefreshing, refresh } = cryptoDataMap[currency];
          
          return (
            <CryptoCard
              key={currency}
              currency={currency}
              data={data}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              lastUpdated={lastUpdated}
              onRefresh={refresh}
              error={error}
            />
          );
        })}
      </div>
      
      <div className="text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
        <Clock className="h-4 w-4" />
        <span>Dados atualizados automaticamente a cada {refreshInterval / 1000} segundos</span>
      </div>
    </div>
  );
};

export default CryptoDashboard;
