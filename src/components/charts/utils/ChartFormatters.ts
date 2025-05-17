
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

export const formatBitcoinValue = (value: number): string => {
  if (value === 0) return '0 BTC';
  if (value < 0.00000001) return '< 0.00000001 BTC';
  
  // Para valores pequenos, mostrar todos os decimais necessários
  if (value < 0.0001) {
    return `${value.toFixed(8)} BTC`.replace(/\.?0+$/, ' BTC');
  }
  
  // Para valores médios, limitar a 6 decimais
  if (value < 0.1) {
    return `${value.toFixed(6)} BTC`.replace(/\.?0+$/, ' BTC');
  }
  
  // Para valores maiores, limitar a 4 decimais
  return `${value.toFixed(4)} BTC`.replace(/\.?0+$/, ' BTC');
};

export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
