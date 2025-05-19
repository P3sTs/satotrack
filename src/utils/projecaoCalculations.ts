
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

// Define the projection data structure
interface ProjecaoData {
  date: string;
  projecao: number;
}

/**
 * Calculate projection data for a wallet based on time range and bitcoin price data
 * 
 * @param carteira The bitcoin wallet
 * @param timeRange The time range for the projection
 * @param bitcoinData The bitcoin price data
 * @returns Array of projection data points
 */
export const calculateProjecaoData = (
  carteira: CarteiraBTC,
  timeRange: string,
  bitcoinData?: BitcoinPriceData | null
): ProjecaoData[] => {
  // Default projection data if we can't calculate
  if (!bitcoinData) {
    return generateDefaultProjection(timeRange);
  }
  
  // Determine number of data points based on time range
  const numPoints = getNumPointsFromTimeRange(timeRange);
  
  // Current wallet value in USD
  const currentValueUSD = carteira.saldo * bitcoinData.price_usd;
  
  // Get growth rate based on time range and bitcoin data
  const dailyGrowthRate = getGrowthRate(timeRange, bitcoinData);
  
  const data: ProjecaoData[] = [];
  let currentDate = new Date();
  let currentValue = currentValueUSD;
  
  // Generate data points
  for (let i = 0; i < numPoints; i++) {
    // Add current point to data
    data.push({
      date: formatDate(currentDate),
      projecao: currentValue,
    });
    
    // Advance to next data point
    currentDate = advanceDate(currentDate, timeRange);
    currentValue = currentValue * (1 + dailyGrowthRate);
  }
  
  return data;
};

/**
 * Format a date to display in chart
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
};

/**
 * Advance date based on time range
 */
const advanceDate = (date: Date, timeRange: string): Date => {
  const newDate = new Date(date);
  
  switch (timeRange) {
    case '7D':
      newDate.setDate(newDate.getDate() + 1);
      break;
    case '30D':
      newDate.setDate(newDate.getDate() + 5);
      break;
    case '3M':
      newDate.setDate(newDate.getDate() + 15);
      break;
    case '6M':
      newDate.setDate(newDate.getDate() + 30);
      break;
    case '1Y':
      newDate.setDate(newDate.getDate() + 60);
      break;
    default:
      newDate.setDate(newDate.getDate() + 1);
  }
  
  return newDate;
};

/**
 * Get number of data points based on time range
 */
const getNumPointsFromTimeRange = (timeRange: string): number => {
  switch (timeRange) {
    case '7D': return 7;
    case '30D': return 6;
    case '3M': return 6;
    case '6M': return 6;
    case '1Y': return 6;
    default: return 7;
  }
};

/**
 * Calculate growth rate based on historical data and average purchase price
 */
const getGrowthRate = (timeRange: string, bitcoinData: BitcoinPriceData): number => {
  // Use 24h change percentage as base growth rate
  let baseRate = bitcoinData.price_change_percentage_24h / 100;
  
  // Adjust growth rate based on time range
  switch (timeRange) {
    case '7D':
      // Use 7d change if available, otherwise estimate from 24h
      return bitcoinData.price_change_percentage_7d 
        ? bitcoinData.price_change_percentage_7d / 700 
        : baseRate / 7;
    case '30D':
      return baseRate / 6;
    case '3M':
      return baseRate / 18;
    case '6M':
      return baseRate / 30;
    case '1Y':
      return baseRate / 60;
    default:
      return baseRate / 7;
  }
};

/**
 * Generate default projection data when bitcoin price data is unavailable
 */
const generateDefaultProjection = (timeRange: string): ProjecaoData[] => {
  const numPoints = getNumPointsFromTimeRange(timeRange);
  const data: ProjecaoData[] = [];
  let currentDate = new Date();
  
  for (let i = 0; i < numPoints; i++) {
    data.push({
      date: formatDate(currentDate),
      projecao: 100 + (i * 5), // Simple linear projection
    });
    currentDate = advanceDate(currentDate, timeRange);
  }
  
  return data;
};
