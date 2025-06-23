
export interface TaxTransaction {
  type: 'buy' | 'sell';
  amount: number;
  date: string;
  price: number;
}

export interface TaxCalculation {
  totalGains: number;
  exemptAmount: number;
  taxableAmount: number;
  taxOwed: number;
  exemption: boolean;
  aiInsights?: string;
}

export const TAX_CONSTANTS = {
  EXEMPT_LIMIT: 35000,
  TAX_RATE: 0.15
} as const;
