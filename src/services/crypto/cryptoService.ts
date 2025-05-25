
import axios from 'axios';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  image: string;
  last_updated: string;
}

export interface TechnicalIndicator {
  sma_20: number;
  sma_50: number;
  ema_20: number;
  ema_50: number;
  rsi: number;
  macd: {
    line: number;
    signal: number;
    histogram: number;
  };
}

export interface HistoricalPrice {
  timestamp: number;
  price: number;
  volume: number;
}

// Função para buscar dados de múltiplas criptomoedas
export const fetchMultipleCryptos = async (): Promise<CryptoData[]> => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          ids: 'bitcoin,ethereum,solana,binancecoin,cardano,polkadot,chainlink,polygon',
          order: 'market_cap_desc',
          per_page: 8,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados de criptomoedas:', error);
    return [];
  }
};

// Função para buscar dados históricos
export const fetchHistoricalData = async (
  coinId: string, 
  days: number = 30
): Promise<HistoricalPrice[]> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: days > 90 ? 'daily' : 'hourly'
        }
      }
    );
    
    return response.data.prices.map((price: [number, number], index: number) => ({
      timestamp: price[0],
      price: price[1],
      volume: response.data.total_volumes[index]?.[1] || 0
    }));
  } catch (error) {
    console.error('Erro ao buscar dados históricos:', error);
    return [];
  }
};

// Cálculo de Média Móvel Simples (SMA)
export const calculateSMA = (prices: number[], period: number): number => {
  if (prices.length < period) return 0;
  const recentPrices = prices.slice(-period);
  const sum = recentPrices.reduce((acc, price) => acc + price, 0);
  return sum / period;
};

// Cálculo de Média Móvel Exponencial (EMA)
export const calculateEMA = (prices: number[], period: number): number => {
  if (prices.length < period) return 0;
  
  const multiplier = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
  }
  
  return ema;
};

// Cálculo do RSI (Índice de Força Relativa)
export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50;
  
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1];
    gains.push(difference > 0 ? difference : 0);
    losses.push(difference < 0 ? Math.abs(difference) : 0);
  }
  
  const avgGain = gains.slice(-period).reduce((sum, gain) => sum + gain, 0) / period;
  const avgLoss = losses.slice(-period).reduce((sum, loss) => sum + loss, 0) / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

// Função para calcular todos os indicadores técnicos
export const calculateTechnicalIndicators = (prices: number[]): TechnicalIndicator => {
  const sma_20 = calculateSMA(prices, 20);
  const sma_50 = calculateSMA(prices, 50);
  const ema_20 = calculateEMA(prices, 20);
  const ema_50 = calculateEMA(prices, 50);
  const rsi = calculateRSI(prices);
  
  // MACD simplificado
  const ema_12 = calculateEMA(prices, 12);
  const ema_26 = calculateEMA(prices, 26);
  const macdLine = ema_12 - ema_26;
  const macdSignal = calculateEMA([macdLine], 9);
  const macdHistogram = macdLine - macdSignal;
  
  return {
    sma_20,
    sma_50,
    ema_20,
    ema_50,
    rsi,
    macd: {
      line: macdLine,
      signal: macdSignal,
      histogram: macdHistogram
    }
  };
};
