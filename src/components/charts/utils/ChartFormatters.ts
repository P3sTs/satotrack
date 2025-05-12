
import { format } from 'date-fns';

/**
 * Format X-axis values based on time range
 */
export const formatXAxis = (timestamp: number, timeRange: '7D' | '30D' | '6M' | '1Y'): string => {
  const date = new Date(timestamp);
  
  switch (timeRange) {
    case '7D':
      return format(date, 'dd MMM HH:mm');
    case '30D':
      return format(date, 'dd MMM');
    case '6M':
    case '1Y':
      return format(date, 'MMM yyyy');
    default:
      return format(date, 'dd MMM');
  }
};

/**
 * Format currency values for chart axes
 */
export const formatCurrencyValue = (value: number): string => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  
  return `$${value.toFixed(0)}`;
};

/**
 * Format Bitcoin values for chart axes
 */
export const formatBitcoinValue = (value: number): string => {
  if (value < 0.001) {
    return `${(value * 1000000).toFixed(2)} sats`;
  }
  
  return `₿ ${value.toFixed(8)}`;
};

/**
 * Format date and time for tooltips
 */
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, 'dd MMM yyyy HH:mm');
};

/**
 * Format BRL currency values
 */
export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
