
// Format X-axis date based on time range
export const formatXAxis = (timestamp: number, timeRange: string): string => {
  const date = new Date(timestamp);
  
  // Different formatting based on time range
  switch (timeRange) {
    case '1D':
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    case '7D':
      return `${date.getDate()}/${date.getMonth() + 1}`;
    case '30D':
      return `${date.getDate()}/${date.getMonth() + 1}`;
    case '6M':
    case '1Y':
      return `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(2)}`;
    default:
      return `${date.getDate()}/${date.getMonth() + 1}`;
  }
};

// Format currency values (USD)
export const formatCurrencyValue = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format Bitcoin values
export const formatBitcoinValue = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(value);
};

// Format date and time
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Format BRL currency
export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
