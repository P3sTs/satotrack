
export interface StakingProtocol {
  id: string;
  name: string;
  network: string;
  contractAddress: string;
  abi: any[];
  token: string;
  apy: number;
  minAmount: string;
  isActive: boolean;
}

export interface StakingPosition {
  id: string;
  userId: string;
  protocolId: string;
  walletAddress: string;
  stakedAmount: string;
  rewardsEarned: string;
  transactionHash: string;
  status: 'pending' | 'active' | 'unstaking' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface StakingReward {
  id: string;
  positionId: string;
  amount: string;
  timestamp: string;
  claimed: boolean;
}

export interface StakingTransaction {
  hash: string;
  type: 'stake' | 'unstake' | 'claim';
  amount: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: string;
  gasFee?: string;
}
