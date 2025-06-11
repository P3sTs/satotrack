
export interface RiskMetrics {
  walletId: string;
  walletName: string;
  volatilityScore: number;
  movementFrequency: number;
  networkFeeImpact: number;
  balanceStability: number;
  riskLevel: 'low' | 'medium' | 'high';
  alerts: string[];
}

export interface BalanceVariationData {
  time: string;
  value: number;
  timestamp: Date;
}
