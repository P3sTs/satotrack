
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formats a BTC value with 8 decimal places when needed
export const formatBitcoinValue = (value: number): string => {
  if (value === 0) return '0 BTC';
  if (value < 0.00000001) return '< 0.00000001 BTC';
  
  // For small amounts, show all required decimals
  if (value < 0.0001) {
    return `${value.toFixed(8)} BTC`.replace(/\.?0+$/, '');
  }
  
  // For medium amounts, limit to 6 decimals
  if (value < 0.1) {
    return `${value.toFixed(6)} BTC`.replace(/\.?0+$/, '');
  }
  
  // For larger amounts, limit to 4 decimals
  return `${value.toFixed(4)} BTC`.replace(/\.?0+$/, '');
};

// Formats a bitcoin price in USD
export const formatBitcoinPrice = (price: number): string => {
  if (price === 0) return '$0.00';
  
  // For large prices (over $1000), use commas as thousands separators
  if (price >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(price);
  }
  
  // For small prices, show more decimals
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(price);
};

// Format date for display
export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, "dd MMM yyyy HH:mm", {
    locale: ptBR
  });
};

// Format percentage
export const formatPercentage = (value: number): string => {
  const formatted = value.toFixed(2);
  return `${value >= 0 ? '+' : ''}${formatted}%`;
};

// Format short date (only day and month)
export const formatShortDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, "dd MMM", {
    locale: ptBR
  });
};

// Format time only (hour and minute)
export const formatTime = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, "HH:mm", {
    locale: ptBR
  });
};

// Format compact number (1000 -> 1K)
export const formatCompactNumber = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });
  return formatter.format(value);
};

// Format full date with words
export const formatFullDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR
  });
};
