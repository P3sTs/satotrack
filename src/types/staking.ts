
export interface StakingProtocol {
  id: string;
  name: string;
  network: string;
  contract_address: string;
  abi: any[];
  token: string;
  apy: number;
  min_amount: string;
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
  staked_amount: string;
  rewards_earned: string;
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
  amount: string;
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
  amount: string;
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
