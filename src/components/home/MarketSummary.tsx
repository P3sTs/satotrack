
import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BitcoinPriceCard from './BitcoinPriceCard';
import BitcoinCandlestickChart from './BitcoinCandlestickChart';
import { formatarData } from '@/utils/formatters';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface MarketSummaryProps {
  isLoading: boolean;
  isRefreshing: boolean;
  bitcoinData: BitcoinPriceData | null;
  previousPrice: number | null;
  onRefresh: () => void;
}

const MarketSummary = ({ 
  isLoading, 
  isRefreshing, 
  bitcoinData, 
  previousPrice,
  onRefresh 
}: MarketSummaryProps) => {
  return (
    <section className="container px-4 md:px-6 py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Mercado Bitcoin</h2>
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2 border-bitcoin text-bitcoin hover:bg-bitcoin/10"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {bitcoinData?.market_trend === 'bullish' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <p className="text-green-800">
            <strong>Mercado em Alta:</strong> O Bitcoin está em tendência de alta com variação positiva significativa nas últimas 24h.
          </p>
        </div>
      )}

      {bitcoinData?.market_trend === 'bearish' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 mb-6">
          <TrendingDown className="h-5 w-5 text-red-600" />
          <p className="text-red-800">
            <strong>Mercado em Baixa:</strong> O Bitcoin está em tendência de queda com variação negativa significativa nas últimas 24h.
          </p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bitcoin"></div>
        </div>
      ) : bitcoinData ? (
        <>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-bitcoin p-2 rounded-full">
                  <img 
                    src="/bitcoin-logo.svg" 
                    alt="Bitcoin" 
                    className="h-8 w-8"
                    onError={(e) => {
                      e.currentTarget.src = 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg';
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Bitcoin</h2>
                  <p className="text-sm text-muted-foreground">
                    Atualizado: {formatarData(bitcoinData.last_updated)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="col-span-1 lg:col-span-2">
                <BitcoinCandlestickChart 
                  priceUSD={bitcoinData.price_usd}
                  changePercentage={bitcoinData.price_change_percentage_24h}
                />
              </div>
              
              <div className="space-y-6">
                {/* Preço em USD */}
                <BitcoinPriceCard
                  title="Bitcoin (USD)"
                  price={bitcoinData.price_usd}
                  previousPrice={previousPrice}
                  currency="USD"
                  changePercentage={bitcoinData.price_change_percentage_24h}
                  animateChanges={true}
                />
                
                {/* Preço em BRL */}
                <BitcoinPriceCard
                  title="Bitcoin (BRL)"
                  price={bitcoinData.price_brl}
                  currency="BRL"
                  changePercentage={bitcoinData.price_change_percentage_24h}
                  animateChanges={false}
                />
                
                {/* Volume 24h */}
                <BitcoinPriceCard
                  title="Volume 24h"
                  price={bitcoinData.volume_24h_usd}
                  currency="USD"
                  showChange={false}
                  digits={0}
                  animateChanges={false}
                />
              </div>
            </div>

            {/* Market Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <Card className="bitcoin-card border-none shadow-md">
                <CardContent className="pt-6 pb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Capitalização de Mercado
                  </p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact',
                      compactDisplay: 'short',
                    }).format(bitcoinData.market_cap_usd)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bitcoin-card border-none shadow-md">
                <CardContent className="pt-6 pb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Variação 24h
                  </p>
                  <div className={`flex items-center text-2xl font-bold ${
                    bitcoinData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {bitcoinData.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="mr-1 h-5 w-5" />
                    ) : (
                      <TrendingDown className="mr-1 h-5 w-5" />
                    )}
                    {bitcoinData.price_change_percentage_24h >= 0 ? '+' : ''}
                    {bitcoinData.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bitcoin-card border-none shadow-md">
                <CardContent className="pt-6 pb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Tendência
                  </p>
                  <div className={`text-lg font-semibold ${
                    bitcoinData.market_trend === 'bullish' ? 'text-green-500' : 
                    bitcoinData.market_trend === 'bearish' ? 'text-red-500' : 
                    'text-yellow-500'
                  }`}>
                    {bitcoinData.market_trend === 'bullish' && (
                      <span className="flex items-center">
                        <TrendingUp className="mr-1 h-5 w-5" />
                        Mercado em Alta
                      </span>
                    )}
                    {bitcoinData.market_trend === 'bearish' && (
                      <span className="flex items-center">
                        <TrendingDown className="mr-1 h-5 w-5" />
                        Mercado em Baixa
                      </span>
                    )}
                    {bitcoinData.market_trend === 'neutral' && (
                      <span className="flex items-center">
                        <AlertCircle className="mr-1 h-5 w-5" />
                        Mercado Neutro
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bitcoin-card border-none shadow-md">
                <CardContent className="pt-6 pb-6 flex flex-col justify-between h-full">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Informações
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Atualização:</span>
                    <span className="text-sm font-medium">a cada 10s</span>
                  </div>
                  {bitcoinData.last_updated && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Última:</span>
                      <span className="text-sm font-medium">
                        {new Date(bitcoinData.last_updated).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
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

export default MarketSummary;
