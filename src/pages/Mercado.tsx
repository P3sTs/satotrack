
import React, { useState } from 'react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InteractiveChart from '@/components/charts/InteractiveChart';
import { TimeRange } from '@/components/charts/selectors/TimeRangeSelector';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import MarketTrendAlerts from '@/components/home/MarketTrendAlerts';

const Mercado = () => {
  const { data: bitcoinData, isLoading, isRefreshing, refresh } = useBitcoinPrice();
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Carregando dados do mercado...</p>
      </div>
    );
  }
  
  if (!bitcoinData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Erro ao carregar dados do mercado.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Mercado Bitcoin</h1>
        <Button 
          variant="outline" 
          onClick={refresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2 mt-2 sm:mt-0"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>
      
      <MarketTrendAlerts bitcoinData={bitcoinData} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Preço Atual</CardTitle>
            <CardDescription>Valor do Bitcoin</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {bitcoinData.price_usd.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Variação 24h</CardTitle>
            <CardDescription>Mudança em 24 horas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${bitcoinData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {bitcoinData.price_change_percentage_24h >= 0 ? '+' : ''}{bitcoinData.price_change_percentage_24h.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Volume 24h</CardTitle>
            <CardDescription>Volume negociado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {bitcoinData.volume_24h_usd.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              })}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Preço</CardTitle>
            <CardDescription>Histórico de preços do Bitcoin</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <InteractiveChart bitcoinData={bitcoinData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Mercado;
