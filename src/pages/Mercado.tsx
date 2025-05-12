
import React from 'react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Mercado = () => {
  const { data: bitcoinData, isLoading, isRefreshing } = useBitcoinPrice();
  
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
      <h1 className="text-2xl font-bold mb-6">Mercado Bitcoin</h1>
      
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
            {/* Chart component would go here */}
            <div className="h-full w-full flex items-center justify-center bg-dashboard-medium/20 rounded-lg">
              <p className="text-gray-400">Gráfico de preço do Bitcoin será exibido aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Mercado;
