
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Volume } from 'lucide-react';
import { useI18n } from '@/contexts/i18n/I18nContext';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
}

const MarketSummary: React.FC = () => {
  const { t } = useI18n();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do mercado:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, []);

  const topGainers = cryptoData
    .filter(crypto => crypto.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 3);

  const topLosers = cryptoData
    .filter(crypto => crypto.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 3);

  const topVolume = cryptoData
    .sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.marketSummary}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">{t.common.loading}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            {t.dashboard.cryptosUp}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topGainers.map((crypto) => (
            <div key={crypto.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{crypto.symbol.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(crypto.current_price)}</p>
              </div>
              <span className="text-green-500 text-sm font-medium">
                {formatPercentage(crypto.price_change_percentage_24h)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            {t.dashboard.cryptosDown}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topLosers.map((crypto) => (
            <div key={crypto.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{crypto.symbol.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(crypto.current_price)}</p>
              </div>
              <span className="text-red-500 text-sm font-medium">
                {formatPercentage(crypto.price_change_percentage_24h)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-bitcoin/20 bg-bitcoin/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Volume className="h-4 w-4 text-bitcoin" />
            {t.dashboard.topVolume}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topVolume.map((crypto) => (
            <div key={crypto.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{crypto.symbol.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(crypto.current_price)}</p>
              </div>
              <span className="text-bitcoin text-xs">
                ${(crypto.total_volume / 1000000).toFixed(1)}M
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketSummary;
