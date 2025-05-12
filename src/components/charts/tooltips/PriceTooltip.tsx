
import React from 'react';
import { TooltipProps } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface PriceTooltipProps extends TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const PriceTooltip: React.FC<PriceTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const price = payload[0].value;
    const date = new Date(data.timestamp);
    
    return (
      <Card className="border shadow-md bg-background/90 backdrop-blur-sm">
        <CardContent className="p-3">
          <p className="font-medium text-sm text-muted-foreground">{formatDate(date)}</p>
          <p className="font-bold text-bitcoin text-lg">{formatCurrency(price, 'USD')}</p>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export default PriceTooltip;
