
import { RiskMetrics, BalanceVariationData } from '../types/riskTypes';

export const calculateRiskMetrics = (carteiras: any[], networkFeeRate: number): RiskMetrics[] => {
  return carteiras.map(carteira => {
    // Simulação de dados de risco (em produção viria de análise real)
    const volatilityScore = Math.random() * 100;
    const movementFrequency = Math.floor(Math.random() * 20) + 1; // transações/dia
    const networkFeeImpact = (movementFrequency * networkFeeRate * 0.00001); // BTC
    const balanceStability = 100 - (Math.random() * 50); // %
    
    // Calcular nível de risco
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (volatilityScore > 70 || movementFrequency > 15) riskLevel = 'high';
    else if (volatilityScore > 40 || movementFrequency > 8) riskLevel = 'medium';

    // Gerar alertas
    const alerts = [];
    if (movementFrequency > 10) {
      alerts.push('Alta frequência de movimentações detectada - considere consolidar transações');
    }
    if (networkFeeImpact > 0.0001) {
      alerts.push(`Impacto de taxas alto: ${(networkFeeImpact * 100000).toFixed(0)} sats/dia`);
    }
    if (balanceStability < 60) {
      alerts.push('Baixa estabilidade de saldo - alta volatilidade detectada');
    }
    if (volatilityScore > 80) {
      alerts.push('Padrão de uso de alto risco identificado');
    }

    return {
      walletId: carteira.id,
      walletName: carteira.nome,
      volatilityScore,
      movementFrequency,
      networkFeeImpact,
      balanceStability,
      riskLevel,
      alerts
    };
  });
};

export const generateBalanceVariationData = (selectedTimeframe: '24h' | '48h' | '7d'): BalanceVariationData[] => {
  const hours = selectedTimeframe === '24h' ? 24 : selectedTimeframe === '48h' ? 48 : 168;
  const data = [];
  
  for (let i = 0; i < hours; i++) {
    const baseValue = 1000000; // sats
    const variation = (Math.sin(i / 4) + Math.random() - 0.5) * 50000;
    data.push({
      time: i + 'h',
      value: baseValue + variation,
      timestamp: new Date(Date.now() - (hours - i) * 60 * 60 * 1000)
    });
  }
  
  return data;
};

export const getRiskColor = (level: string): string => {
  switch (level) {
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-green-500/20 text-green-400 border-green-500/30';
  }
};
