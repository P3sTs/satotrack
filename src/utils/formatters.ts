
export const formatBitcoinValue = (value: number): string => {
  if (value >= 1) {
    return `${value.toFixed(8)} BTC`;
  } else {
    return `${(value * 100000000).toFixed(0)} sats`;
  }
};

export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (value: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

// Aliases for legacy compatibility
export const formatarBTC = formatBitcoinValue;
export const formatarData = formatDate;
export const formatBitcoinPrice = formatCurrency;

export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Agora mesmo';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m atrás`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h atrás`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d atrás`;
  }
};
