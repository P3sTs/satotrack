
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Bitcoin, DollarSign } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WalletMetricsControlsProps {
  timeRange: '7d' | '30d' | '90d';
  currency: 'BTC' | 'USD' | 'BRL';
  onTimeRangeChange: (range: '7d' | '30d' | '90d') => void;
  onCurrencyChange: (currency: 'BTC' | 'USD' | 'BRL') => void;
}

export const WalletMetricsControls: React.FC<WalletMetricsControlsProps> = ({
  timeRange,
  currency,
  onTimeRangeChange,
  onCurrencyChange
}) => {
  const getDateRangeText = () => {
    const today = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = subDays(today, 7);
        break;
      case '30d':
        startDate = subDays(today, 30);
        break;
      case '90d':
        startDate = subDays(today, 90);
        break;
    }
    
    return `${format(startDate, 'PP', { locale: ptBR })} - ${format(today, 'PP', { locale: ptBR })}`;
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>{getDateRangeText()}</span>
      </div>
      
      <div className="flex gap-2">
        <div className="bg-muted/30 rounded-lg p-1">
          <TabsList className="h-8">
            <TabsTrigger 
              value="7d" 
              onClick={() => onTimeRangeChange('7d')}
              className={timeRange === '7d' ? 'bg-satotrack-neon/20 text-satotrack-neon' : ''}
            >
              7D
            </TabsTrigger>
            <TabsTrigger 
              value="30d"
              onClick={() => onTimeRangeChange('30d')}
              className={timeRange === '30d' ? 'bg-satotrack-neon/20 text-satotrack-neon' : ''}
            >
              30D
            </TabsTrigger>
            <TabsTrigger 
              value="90d"
              onClick={() => onTimeRangeChange('90d')}
              className={timeRange === '90d' ? 'bg-satotrack-neon/20 text-satotrack-neon' : ''}
            >
              90D
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-1">
          <TabsList className="h-8">
            <TabsTrigger 
              value="BTC"
              onClick={() => onCurrencyChange('BTC')}
              className={currency === 'BTC' ? 'bg-bitcoin/20 text-bitcoin' : ''}
            >
              <Bitcoin className="h-3 w-3 mr-1" />
            </TabsTrigger>
            <TabsTrigger 
              value="USD"
              onClick={() => onCurrencyChange('USD')}
              className={currency === 'USD' ? 'bg-green-500/20 text-green-500' : ''}
            >
              <DollarSign className="h-3 w-3 mr-1" />
              USD
            </TabsTrigger>
            <TabsTrigger 
              value="BRL"
              onClick={() => onCurrencyChange('BRL')}
              className={currency === 'BRL' ? 'bg-yellow-500/20 text-yellow-500' : ''}
            >
              <span className="mr-1">R$</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
    </div>
  );
};
