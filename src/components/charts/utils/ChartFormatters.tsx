
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TimeRange = '1D' | '7D' | '30D';

/**
 * Format bitcoin value for display
 */
export const formatBitcoinValue = (value: number): string => {
  return `₿ ${value.toFixed(8)}`;
};

/**
 * Format currency value for display
 */
export const formatCurrencyValue = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format X axis timestamps based on selected time range
 */
export const formatXAxis = (timestamp: number, timeRange: TimeRange): string => {
  if (timeRange === '1D') {
    return format(timestamp, 'HH:mm', { locale: ptBR });
  } else if (timeRange === '7D') {
    return format(timestamp, 'EEE', { locale: ptBR });
  } else {
    return format(timestamp, 'dd/MM', { locale: ptBR });
  }
};
