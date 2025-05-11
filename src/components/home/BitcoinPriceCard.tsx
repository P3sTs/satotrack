
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

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
  const [animate, setAnimate] = useState<'increase' | 'decrease' | null>(null);
  const [lastPrice, setLastPrice] = useState(price);

  useEffect(() => {
    if (animateChanges && previousPrice !== null && previousPrice !== undefined) {
      if (price > previousPrice) {
        setAnimate('increase');
      } else if (price < previousPrice) {
        setAnimate('decrease');
      }
      
      const timer = setTimeout(() => {
        setAnimate(null);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    
    setLastPrice(price);
  }, [price, previousPrice, animateChanges]);
  
  return (
    <Card className={`bitcoin-card overflow-hidden border-none shadow-md transition-all duration-300 ${
      animate === 'increase' ? 'ring-2 ring-green-500' : 
      animate === 'decrease' ? 'ring-2 ring-red-500' : ''
    }`}>
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-baseline justify-between">
          <div className={`text-2xl md:text-3xl font-bold transition-colors duration-500 ${
            animate === 'increase' ? 'text-green-500' : 
            animate === 'decrease' ? 'text-red-500' : ''
          }`}>
            {formatCurrency(price, currency, digits)}
          </div>
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
        
        {animate && (
          <div className={`mt-2 text-xs font-medium ${
            animate === 'increase' ? 'text-green-500' : 'text-red-500'
          }`}>
            {animate === 'increase' ? '↑ Em alta' : '↓ Em queda'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BitcoinPriceCard;
