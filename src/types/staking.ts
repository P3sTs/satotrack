
export interface StakingProtocol {
  id: string;
  name: string;
  network: string;
  contract_address: string;
  abi: any; // Change from any[] to any to match Supabase Json type
  token: string;
  apy: number;
  min_amount: number; // Change from string to number to match database
  platform_fee_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StakingPosition {
  id: string;
  user_id: string;
  protocol_id: string;
  wallet_address: string;
  staked_amount: number; // Change from string to number to match database
  rewards_earned: number; // Change from string to number to match database
  transaction_hash: string;
  status: 'pending' | 'active' | 'unstaking' | 'completed';
  created_at: string;
  updated_at: string;
  
  // Joined data from protocol
  protocol?: StakingProtocol;
}

export interface StakingReward {
  id: string;
  position_id: string;
  amount: number; // Change from string to number to match database
  timestamp: string;
  claimed: boolean;
  transaction_hash?: string;
}

export interface StakingTransaction {
  id: string;
  user_id: string;
  position_id?: string;
  hash: string;
  type: 'stake' | 'unstake' | 'claim';
  amount: number; // Change from string to number to match database
  status: 'pending' | 'confirmed' | 'failed';
  gas_used?: string;
  gas_fee?: string;
  created_at: string;
}

export interface StakingStats {
  totalStaked: number;
  totalRewards: number;
  activePositions: number;
  totalValue: number;
}
