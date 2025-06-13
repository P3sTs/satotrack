
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart2, DollarSign } from 'lucide-react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface PriceCardsProps {
  bitcoinData: BitcoinPriceData;
}

const PriceCards: React.FC<PriceCardsProps> = ({ bitcoinData }) => {
  const priceChangeClass = bitcoinData.price_change_percentage_24h >= 0 
    ? 'text-green-500' 
    : 'text-red-500';
  
  const priceChangeIcon = bitcoinData.price_change_percentage_24h >= 0 
    ? <TrendingUp className="h-6 w-6" /> 
    : <TrendingDown className="h-6 w-6" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="cyberpunk-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Preço Atual</span>
            <DollarSign className="h-5 w-5 text-satotrack-neon" />
          </CardTitle>
          <CardDescription>Valor do Bitcoin</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {bitcoinData.price_usd.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'USD'
            })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {bitcoinData.price_brl.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>
        </CardContent>
      </Card>
      
      <Card className="cyberpunk-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Variação 24h</span>
            {priceChangeIcon}
          </CardTitle>
          <CardDescription>Mudança em 24 horas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${priceChangeClass}`}>
            {bitcoinData.price_change_percentage_24h >= 0 ? '+' : ''}{bitcoinData.price_change_percentage_24h.toFixed(2)}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {bitcoinData.price_change_24h >= 0 ? '+' : '-'}
            {Math.abs(bitcoinData.price_change_24h).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'USD'
            })}
          </p>
        </CardContent>
      </Card>
      
      <Card className="cyberpunk-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Volume 24h</span>
            <BarChart2 className="h-5 w-5 text-satotrack-neon" />
          </CardTitle>
          <CardDescription>Volume negociado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {(bitcoinData.volume_24h_usd || 0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {((bitcoinData.volume_24h_usd || 0) / bitcoinData.price_usd).toFixed(2)} BTC
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceCards;
