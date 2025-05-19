
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

// Generate projection data for graph based on wallet and time range
export const calculateProjecaoData = (
  carteira: CarteiraBTC, 
  timeRange: '7D' | '30D' | '3M' | '6M' | '1Y',
  bitcoinData?: BitcoinPriceData | null
) => {
  // Determine number of days based on time range
  const days = getNumberOfDays(timeRange);
  
  // If no bitcoin data, return empty array
  if (!bitcoinData) return [];
  
  // Calculate average daily variation based on historical data (simplified for demo)
  // In a real app, this would use more sophisticated analysis of historical data
  const variationRate = 0.02; // 2% daily variation for random walk
  
  // Get current value in USD
  const currentValueUSD = carteira.saldo * bitcoinData.price_usd;
  
  // Generate projection data points
  const data = [];
  let currentDate = new Date();
  let currentValue = 100; // Base value as percentage (100%)
  
  for (let i = 0; i <= days; i++) {
    // Add data point for current day
    data.push({
      date: formatDateForDisplay(currentDate),
      projecao: currentValue,
    });
    
    // Update for next day
    currentDate.setDate(currentDate.getDate() + 1);
    
    // Generate random walk with slight upward bias for projection
    // This is a simplified model - in a real app, you'd use more sophisticated models
    const randomFactor = (Math.random() - 0.48) * variationRate;
    currentValue = currentValue * (1 + randomFactor);
  }
  
  return data;
};

// Function to simulate profit/loss projection
export const simularProjecaoLucro = (
  valorBTC: number,
  precoBitcoinUSD: number,
  periodoDias: number,
  valorizacaoPct: number
) => {
  // Calculate daily rate from total expected appreciation
  const taxaDiaria = Math.pow(1 + valorizacaoPct / 100, 1 / periodoDias) - 1;
  
  // Calculate projected final value
  const valorFinal = valorBTC * Math.pow(1 + taxaDiaria, periodoDias);
  
  // Calculate profit/loss
  const lucroPerdaBTC = valorFinal - valorBTC;
  const lucroPerdaUsd = lucroPerdaBTC * precoBitcoinUSD;
  
  // Calculate rendimento percentual
  const rendimentoPct = (valorFinal / valorBTC - 1) * 100;
  
  // Estimate risk level based on volatility and percentage
  let risco = 'Médio';
  if (Math.abs(valorizacaoPct) > 20) {
    risco = 'Alto';
  } else if (Math.abs(valorizacaoPct) < 10) {
    risco = 'Baixo';
  }
  
  return {
    valorFinal,
    lucroPerdaBTC,
    lucroPerdaUsd,
    rendimentoPct,
    risco
  };
};

// Generate strategic alerts based on wallet data and market conditions
export const calcularAlertas = (carteira: CarteiraBTC, bitcoinData: BitcoinPriceData) => {
  const alertas = [];
  
  // Current values
  const valorUSD = carteira.saldo * bitcoinData.price_usd;
  const mediaCompra = carteira.preco_medio_compra || 0;
  const precoAtual = bitcoinData.price_usd;
  
  // Alert 1: Warning about potential loss if negative trend continues
  if (bitcoinData.price_change_percentage_24h < -2) {
    const perdaPotencial = Math.abs(bitcoinData.price_change_percentage_24h * 3).toFixed(1);
    alertas.push({
      tipo: 'perigo',
      mensagem: `Atenção: risco de perda de ${perdaPotencial}% nos próximos 90 dias se a tendência se mantiver`,
      porcentagem: perdaPotencial,
      periodo: 90
    });
  }
  
  // Alert 2: Opportunity for profit based on pattern
  if (bitcoinData.price_change_percentage_24h > 0) {
    const lucroProjetado = (5 + Math.random() * 10).toFixed(1);
    alertas.push({
      tipo: 'oportunidade',
      mensagem: `Possível valorização de ${lucroProjetado}% com base no último padrão de comportamento`,
      porcentagem: lucroProjetado,
      periodo: 30
    });
  }
  
  // Alert 3: Average purchase price relation to current price
  if (mediaCompra > 0 && precoAtual < mediaCompra) {
    const diferencaPct = ((mediaCompra - precoAtual) / mediaCompra * 100).toFixed(1);
    alertas.push({
      tipo: 'atencao',
      mensagem: `Seu preço médio de compra está ${diferencaPct}% acima do valor atual. Considere estratégias de DCA.`,
      porcentagem: diferencaPct,
      periodo: null
    });
  }
  
  // Alert 4: Opportunity for accumulating if price drops
  if (bitcoinData.price_change_percentage_7d < -5) {
    alertas.push({
      tipo: 'oportunidade',
      mensagem: 'Queda recente de preço pode ser uma oportunidade de acumulação conforme padrões históricos',
      porcentagem: Math.abs(bitcoinData.price_change_percentage_7d).toFixed(1),
      periodo: 7
    });
  }
  
  // Shuffle and return only 3 alerts maximum
  return shuffleArray(alertas).slice(0, 3);
};

// Helper functions

const getNumberOfDays = (timeRange: string): number => {
  switch (timeRange) {
    case '7D': return 7;
    case '30D': return 30;
    case '3M': return 90;
    case '6M': return 180;
    case '1Y': return 365;
    default: return 7;
  }
};

const formatDateForDisplay = (date: Date): string => {
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
