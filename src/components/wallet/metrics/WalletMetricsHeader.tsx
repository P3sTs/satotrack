
import React from 'react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, RefreshCw, Bitcoin, DollarSign } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WalletMetricsHeaderProps {
  timeRange: '7d' | '30d' | '90d';
  currency: 'BTC' | 'USD' | 'BRL';
  isUpdating: boolean;
  walletId: string;
  onTimeRangeChange: (range: '7d' | '30d' | '90d') => void;
  onCurrencyChange: (currency: 'BTC' | 'USD' | 'BRL') => void;
  onUpdate: () => void;
}

export const WalletMetricsHeader: React.FC<WalletMetricsHeaderProps> = ({
  timeRange,
  currency,
  isUpdating,
  walletId,
  onTimeRangeChange,
  onCurrencyChange,
  onUpdate
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
    <div className="flex flex-wrap justify-between items-center">
      <div className="text-lg font-medium">Métricas Avançadas</div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onUpdate}
        disabled={isUpdating}
        className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
      >
        <RefreshCw 
          className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} 
        />
        Atualizar
      </Button>
    </div>
  );
};
