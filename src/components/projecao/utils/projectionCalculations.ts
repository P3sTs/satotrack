
import { ProjectionDataPoint, ProjectionScenarios, TimeframeType, ScenarioType } from '../types/projectionTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';

const PROJECTION_SCENARIOS: ProjectionScenarios = {
  conservative: { monthly: 0.02, volatility: 0.1 }, // 2% ao mês
  moderate: { monthly: 0.05, volatility: 0.15 },    // 5% ao mês
  aggressive: { monthly: 0.10, volatility: 0.25 }   // 10% ao mês
};

export const generateProjectionData = (
  carteiras: CarteiraBTC[],
  bitcoinData: BitcoinPriceData,
  timeframe: TimeframeType,
  scenario: ScenarioType
): ProjectionDataPoint[] => {
  const currentBalance = carteiras.reduce((acc, carteira) => acc + carteira.saldo, 0);
  const currentValueBRL = currentBalance * bitcoinData.price_brl;
  
  const selectedScenario = PROJECTION_SCENARIOS[scenario];
  const months = timeframe === '3m' ? 3 : timeframe === '6m' ? 6 : 12;
  
  const data: ProjectionDataPoint[] = [];
  
  for (let i = 0; i <= months; i++) {
    const monthlyGrowth = selectedScenario.monthly;
    const volatility = selectedScenario.volatility;
    
    // Aplicar crescimento com volatilidade
    const baseGrowth = Math.pow(1 + monthlyGrowth, i);
    const volatilityFactor = 1 + (Math.random() - 0.5) * volatility;
    
    const projectedValue = currentValueBRL * baseGrowth * volatilityFactor;
    const btcEquivalent = projectedValue / bitcoinData.price_brl;
    
    data.push({
      month: i === 0 ? 'Atual' : `+${i}m`,
      value: projectedValue,
      btc: btcEquivalent,
      conservative: currentValueBRL * Math.pow(1 + PROJECTION_SCENARIOS.conservative.monthly, i),
      moderate: currentValueBRL * Math.pow(1 + PROJECTION_SCENARIOS.moderate.monthly, i),
      aggressive: currentValueBRL * Math.pow(1 + PROJECTION_SCENARIOS.aggressive.monthly, i),
    });
  }

  return data;
};

export const calculateGrowthPercentage = (projectionData: ProjectionDataPoint[]): number => {
  if (projectionData.length === 0) return 0;
  
  const initial = projectionData[0].value;
  const final = projectionData[projectionData.length - 1].value;
  
  return ((final - initial) / initial) * 100;
};
