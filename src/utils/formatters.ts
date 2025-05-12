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

// Alias for backward compatibility
export const formatarBTC = formatBitcoinValue;

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

// Format currency
export const formatCurrency = (value: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

// Format date for display
export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, "dd MMM yyyy HH:mm", {
    locale: ptBR
  });
};

// Alias for backward compatibility
export const formatarData = formatDate;
export const formatarDataHora = formatDate;

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

/**
 * Formata um timestamp para "tempo atrás" (ex: "5 minutos atrás")
 */
export const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 10) return 'agora';
  if (diffSecs < 60) return `${diffSecs} segundos atrás`;
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'} atrás`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'} atrás`;
  if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'} atrás`;
  
  // Se for mais antigo, usar o formatDate normal
  return formatDate(date);
};
