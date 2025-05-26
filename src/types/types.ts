export interface CarteiraBTC {
  id: string;
  nome: string;
  endereco: string;
  saldo: number;
  total_entradas: number;
  total_saidas: number;
  qtde_transacoes: number;
  ultimo_update: Date | string;
  
  // Multi-chain properties
  network?: any;
  addressType?: string;
  nativeTokenBalance?: number;
  tokensData?: any[];
}

export interface TransacaoBTC {
  hash: string; // Transaction hash
  txid: string; // Same as hash, needed for compatibility
  valor: number; // Value in BTC
  tipo: 'entrada' | 'saida'; // Type: received or sent
  data: Date | string; // Date of the transaction
  endereco: string; // Address involved in the transaction
}

export type SortOption = 'saldo' | 'ultimo_update';
export type SortDirection = 'asc' | 'desc';

export interface DatabaseCarteiraBTC {
  id: string;
  name: string;
  address: string;
  balance: number;
  last_updated: string;
  total_received: number;
  total_sent: number;
  transaction_count: number;
  created_at: string;
  user_id: string;
}

export interface DatabaseTransacaoBTC {
  id: string;
  wallet_id: string;
  hash: string;
  amount: number;
  transaction_type: 'entrada' | 'saida';
  transaction_date: string;
  created_at: string;
}

export interface ReferralData {
  code: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
}

export interface GrowthMetrics {
  totalUsers: number;
  activeUsers: number;
  conversionRate: number;
  mrr: number;
  cac: number;
  ltv: number;
  churnRate: number;
}

export interface AcquisitionChannel {
  name: string;
  percentage: number;
  cac: number;
  conversionRate: number;
}

export interface CohortData {
  cohort: string;
  month0: number;
  month1: number;
  month2: number;
  month3: number;
}

export type PlanType = 'free' | 'pro' | 'premium' | 'enterprise';

export interface PlanFeatures {
  name: string;
  price: string;
  features: string[];
  limitations: string[];
  target: string;
  popular?: boolean;
}
