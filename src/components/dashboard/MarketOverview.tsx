
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MarketOverviewProps {
  currency: 'BRL' | 'USD';
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ currency }) => {
  const { data: bitcoinData } = useBitcoinPrice();
  const navigate = useNavigate();

  if (!bitcoinData) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const price = currency === 'BRL' ? bitcoinData.price_brl : bitcoinData.price_usd;
  const change24h = bitcoinData.price_change_24h || 0;
  const isPositive = change24h > 0;

  // Mock data for other cryptocurrencies
  const otherAssets = [
    { name: 'Ethereum', symbol: 'ETH', price: currency === 'BRL' ? 12500 : 2500, change: 2.4 },
    { name: 'USDT', symbol: 'USDT', price: currency === 'BRL' ? 5.2 : 1.0, change: 0.1 },
  ];

  return (
    <div className="space-y-4">
      {/* Bitcoin */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-bitcoin">Bitcoin (BTC)</div>
            <div className="text-2xl font-bold">
              {formatCurrency(price, currency)}
            </div>
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="h-8 bg-muted rounded-sm flex items-center justify-center text-xs text-muted-foreground">
          Mini gráfico 24h (em desenvolvimento)
        </div>
      </div>

      {/* Other assets */}
      <div className="space-y-2">
        {otherAssets.map((asset, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div>
              <div className="text-sm font-medium">{asset.name}</div>
              <div className="text-sm font-bold">
                {formatCurrency(asset.price, currency)}
              </div>
            </div>
            <div className={`text-sm ${asset.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {asset.change > 0 ? '+' : ''}{asset.change}%
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        className="w-full gap-2"
        onClick={() => navigate('/mercado')}
      >
        <ExternalLink className="h-4 w-4" />
        Ir para Mercado Completo
      </Button>
    </div>
  );
};

export default MarketOverview;
