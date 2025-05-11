
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
  return (
    <Card className="bitcoin-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{formatCurrency(price, currency, digits)}</div>
          {showChange && changePercentage !== undefined && (
            <div className={`flex items-center ${changePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {changePercentage >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{changePercentage.toFixed(2)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BitcoinPriceCard;
