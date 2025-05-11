
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface BitcoinPriceCardProps {
  title: string;
  price: number;
  currency: string;
  changePercentage?: number;
  showChange?: boolean;
  digits?: number;
}

const BitcoinPriceCard = ({ 
  title, 
  price, 
  currency, 
  changePercentage, 
  showChange = true,
  digits = 2 
}: BitcoinPriceCardProps) => {
  const isNegative = changePercentage !== undefined && changePercentage < 0;
  
  return (
    <Card className="bitcoin-card overflow-hidden border-none shadow-md">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl md:text-3xl font-bold">{formatCurrency(price, currency, digits)}</div>
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
