
import React from 'react';
import { useRealtimeBitcoinPrice, useValueChange } from '@/hooks/useRealtimeData';
import { DynamicValue } from './DynamicValue';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatTimeAgo } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

interface RealtimeBitcoinPriceProps {
  refreshInterval?: number;
  showRefreshButton?: boolean;
  showTimeAgo?: boolean;
  size?: 'sm' | 'md' | 'lg';
  currency?: 'USD' | 'BRL';
}

export const RealtimeBitcoinPrice: React.FC<RealtimeBitcoinPriceProps> = ({
  refreshInterval = 30000,
  showRefreshButton = true,
  showTimeAgo = true,
  size = 'md',
  currency = 'USD'
}) => {
  const { 
    data: bitcoinData, 
    previousData, 
    isLoading, 
    isRefreshing,
    lastUpdated,
    refresh 
  } = useRealtimeBitcoinPrice();
  
  const currentPrice = currency === 'USD' ? bitcoinData?.price_usd : bitcoinData?.price_brl;
  const prevPrice = currency === 'USD' ? previousData?.price_usd : previousData?.price_brl;
  const priceChangeState = useValueChange(currentPrice, prevPrice);
  
  const formatPrice = (price: number) => {
    return formatCurrency(price, currency);
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }
  
  return (
    <div className="bitcoin-price-container">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <DynamicValue
            value={currentPrice}
            previousValue={prevPrice}
            formatFunc={formatPrice}
            changeState={priceChangeState}
            size={size}
            className={size === 'lg' ? "text-xl md:text-2xl font-bold" : ""}
          />
          
          {showRefreshButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={isRefreshing}
              className="ml-2 h-7 w-7 p-0"
            >
              <RefreshCw 
                className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} 
              />
              <span className="sr-only">Atualizar preço</span>
            </Button>
          )}
        </div>
        
        {showTimeAgo && lastUpdated && (
          <span className="text-xs text-muted-foreground">
            Atualizado {formatTimeAgo(lastUpdated)}
          </span>
        )}
      </div>
      
      {bitcoinData && (
        <div className="flex items-center mt-1">
          <DynamicValue
            value={bitcoinData.price_change_percentage_24h}
            formatFunc={(val) => `${val > 0 ? '+' : ''}${val.toFixed(2)}%`}
            changeState={bitcoinData.price_change_percentage_24h > 0 ? 'positive' : 
                        bitcoinData.price_change_percentage_24h < 0 ? 'negative' : 'neutral'}
            size="sm"
          />
          <span className="text-xs text-muted-foreground ml-1">24h</span>
        </div>
      )}
    </div>
  );
};
