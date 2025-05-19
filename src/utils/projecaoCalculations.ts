import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

type TimeRange = '7D' | '30D' | '3M' | '6M' | '1Y';

interface ProjecaoDataPoint {
  date: string;
  projecao: number;
}

// Main function to calculate projection data
export const calculateProjecaoData = (
  carteira: CarteiraBTC,
  timeRange: TimeRange,
  bitcoinData: BitcoinPriceData | null
): ProjecaoDataPoint[] => {
  if (!bitcoinData) return [];
  
  // Get number of days based on time range
  const days = getTimeRangeDays(timeRange);
  
  // Calculate initial projection value (usually current balance or price)
  const initialValue = carteira.saldo * bitcoinData.price_usd;
  
  // Get growth rate based on Bitcoin data and time range
  const dailyGrowthRate = getDailyGrowthRate(bitcoinData, timeRange);
  
  // Generate data points for the chart
  return generateProjectionPoints(initialValue, dailyGrowthRate, days);
};

// Helper function to get number of days from time range
const getTimeRangeDays = (timeRange: TimeRange): number => {
  switch (timeRange) {
    case '7D': return 7;
    case '30D': return 30;
    case '3M': return 90;
    case '6M': return 180;
    case '1Y': return 365;
    default: return 7;
  }
};

// Helper function to calculate daily growth rate
const getDailyGrowthRate = (
  bitcoinData: BitcoinPriceData, 
  timeRange: TimeRange
): number => {
  // Use 24h change for short term projections
  if (timeRange === '7D') {
    // Convert percentage to daily growth rate
    return bitcoinData.price_change_percentage_24h / 100;
  }
  
  // For longer projections, use 7d change or lower rate
  if (bitcoinData.price_change_percentage_7d) {
    const weeklyRate = bitcoinData.price_change_percentage_7d / 100;
    // Convert weekly to daily rate
    return weeklyRate / 7;
  }
  
  // Fallback to 24h rate but dampened for longer projections
  return (bitcoinData.price_change_percentage_24h / 100) * 0.7;
};

// Helper function to generate data points for the chart
const generateProjectionPoints = (
  initialValue: number,
  dailyGrowthRate: number,
  days: number
): ProjecaoDataPoint[] => {
  const points: ProjecaoDataPoint[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Apply compound growth
    const projectedValue = initialValue * Math.pow(1 + dailyGrowthRate, i);
    
    points.push({
      date: date.toLocaleDateString(),
      projecao: projectedValue
    });
  }
  
  return points;
};

// Calculate average purchase price if not available
export const calcularPrecoMedioCompra = (carteira: CarteiraBTC, bitcoinPrice: number): number => {
  // If we have a stored average price, use it
  if (carteira.preco_medio_compra && carteira.preco_medio_compra > 0) {
    return carteira.preco_medio_compra;
  }
  
  // Otherwise, estimate based on Bitcoin price and some variance
  // This is a placeholder - in real app would come from transaction history
  const randomFactor = 0.8 + (Math.random() * 0.4); // Between 0.8 and 1.2
  return bitcoinPrice * randomFactor;
};

// Function for profit simulation
export const simularProjecaoLucro = (
  saldoBTC: number,
  periodoSimulacao: number,
  expectativaValorizacao: number,
  precoAtual: number
): {
  lucroProjetado: number;
  percentualRendimento: number;
  riscoEstimado: number;
} => {
  // Calculate projected profit
  const valorAtual = saldoBTC * precoAtual;
  const taxaCrescimentoDiario = expectativaValorizacao / 100 / periodoSimulacao;
  const valorFinal = valorAtual * Math.pow(1 + taxaCrescimentoDiario, periodoSimulacao);
  const lucroProjetado = valorFinal - valorAtual;
  
  // Calculate return percentage
  const percentualRendimento = (lucroProjetado / valorAtual) * 100;
  
  // Estimate risk (higher expectations have higher risk)
  const riscoBase = 5; // Base risk percentage
  const riscoEstimado = riscoBase + (expectativaValorizacao / 10);
  
  return {
    lucroProjetado,
    percentualRendimento,
    riscoEstimado
  };
};

// Structure for alerts
interface Alerta {
  tipo: 'perigo' | 'atencao' | 'oportunidade';
  mensagem: string;
  porcentagem?: number;
  periodo?: number;
}

// Generate strategic alerts based on wallet and Bitcoin data
export const calcularAlertas = (
  carteira: CarteiraBTC,
  bitcoinData: BitcoinPriceData
): Alerta[] => {
  const alertas: Alerta[] = [];
  
  // 1. Alert for significant price changes
  if (Math.abs(bitcoinData.price_change_percentage_24h) > 5) {
    const isPriceIncrease = bitcoinData.price_change_percentage_24h > 0;
    
    alertas.push({
      tipo: isPriceIncrease ? 'oportunidade' : 'perigo',
      mensagem: isPriceIncrease 
        ? 'Alta significativa no preço do Bitcoin nas últimas 24h'
        : 'Queda significativa no preço do Bitcoin nas últimas 24h',
      porcentagem: Math.abs(bitcoinData.price_change_percentage_24h),
      periodo: 1
    });
  }
  
  // 2. Long-term trend alert
  if (bitcoinData.price_change_percentage_7d && Math.abs(bitcoinData.price_change_percentage_7d) > 10) {
    const isPositiveTrend = bitcoinData.price_change_percentage_7d > 0;
    
    alertas.push({
      tipo: isPositiveTrend ? 'oportunidade' : 'atencao',
      mensagem: isPositiveTrend
        ? 'Tendência de alta sustentada nos últimos 7 dias'
        : 'Tendência de queda sustentada nos últimos 7 dias',
      porcentagem: Math.abs(bitcoinData.price_change_percentage_7d),
      periodo: 7
    });
  }
  
  // 3. Alert based on wallet balance and market conditions
  if (carteira.saldo > 0.1) {
    const marketCondition = bitcoinData.market_trend || 'neutral';
    
    if (marketCondition === 'bullish') {
      alertas.push({
        tipo: 'oportunidade',
        mensagem: 'Mercado em alta - considere manter suas posições',
        periodo: 30
      });
    } else if (marketCondition === 'bearish') {
      alertas.push({
        tipo: 'atencao',
        mensagem: 'Mercado em baixa - risco de desvalorização no curto prazo',
        periodo: 14
      });
    }
  }
  
  return alertas;
};
