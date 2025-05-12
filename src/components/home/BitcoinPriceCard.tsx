
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { DynamicValue } from '@/components/dynamic/DynamicValue';
import { ValueChangeState } from '@/hooks/useRealtimeData';

interface BitcoinPriceCardProps {
  title: string;
  price: number;
  previousPrice?: number | null;
  currency: string;
  changePercentage?: number;
  showChange?: boolean;
  digits?: number;
  animateChanges?: boolean;
}

const BitcoinPriceCard = ({ 
  title, 
  price, 
  previousPrice,
  currency, 
  changePercentage, 
  showChange = true,
  digits = 2,
  animateChanges = true
}: BitcoinPriceCardProps) => {
  const isNegative = changePercentage !== undefined && changePercentage < 0;
  
  // Determinar estado de mudança para o DynamicValue
  const getChangeState = (): ValueChangeState => {
    if (previousPrice === undefined || previousPrice === null) return 'initial';
    if (price > previousPrice) return 'increased';
    if (price < previousPrice) return 'decreased';
    return 'unchanged';
  };
  
  const changeState = getChangeState();
  
  return (
    <Card className="bitcoin-card overflow-hidden border-none shadow-md transition-all duration-300">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-baseline justify-between">
          <DynamicValue
            value={price}
            previousValue={previousPrice}
            formatFunc={(val) => formatCurrency(val, currency)}
            changeState={changeState}
            showAnimation={animateChanges}
            className="text-2xl md:text-3xl font-bold"
            iconClassName="h-4 w-4 ml-1"
            showIcon={false}
          />
          
          {showChange && changePercentage !== undefined && (
            <div className={`flex items-center font-medium ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
              {isNegative ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(changePercentage).toFixed(2)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BitcoinPriceCard;
