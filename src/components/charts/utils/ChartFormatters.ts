
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TimeRange } from '../selectors/TimeRangeSelector';

export const formatXAxis = (timestamp: number, timeRange: TimeRange): string => {
  const date = new Date(timestamp);
  
  switch (timeRange) {
    case '24H':
      return format(date, 'HH:mm', { locale: ptBR });
    case '7D':
      return format(date, 'dd/MM', { locale: ptBR });
    case '30D':
    case '90D':
      return format(date, 'dd/MM', { locale: ptBR });
    case '6M':
    case '1Y':
      return format(date, 'MMM/yy', { locale: ptBR });
    default:
      return format(date, 'dd/MM', { locale: ptBR });
  }
};

export const formatCurrencyValue = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
