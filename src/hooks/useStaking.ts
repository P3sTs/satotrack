
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StakingProtocol, StakingPosition, StakingTransaction, StakingStats } from '@/types/staking';

export const useStaking = () => {
  const [protocols, setProtocols] = useState<StakingProtocol[]>([]);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [stats, setStats] = useState<StakingStats>({
    totalStaked: 0,
    totalRewards: 0,
    activePositions: 0,
    totalValue: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadProtocols = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('staking_protocols')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Type assertion to match our interface
      const protocolsData = (data || []).map(protocol => ({
        ...protocol,
        abi: protocol.abi as any // Convert Json to any
      })) as StakingProtocol[];

      setProtocols(protocolsData);
    } catch (error) {
      console.error('Error loading staking protocols:', error);
      toast.error('Erro ao carregar protocolos de staking');
    }
  }, []);

  const loadPositions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('staking_positions')
        .select(`
          *,
          protocol:staking_protocols(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type conversion and assertion
      const positionsData = (data || []).map(pos => ({
        ...pos,
        staked_amount: Number(pos.staked_amount),
        rewards_earned: Number(pos.rewards_earned || 0),
        protocol: pos.protocol ? {
          ...pos.protocol,
          abi: pos.protocol.abi as any
        } : undefined
      })) as StakingPosition[];

      setPositions(positionsData);

      // Calculate stats
      const totalStaked = positionsData
        .filter(pos => pos.status === 'active')
        .reduce((sum, pos) => sum + pos.staked_amount, 0);
      
      const totalRewards = positionsData
        .reduce((sum, pos) => sum + pos.rewards_earned, 0);
      
      const activePositions = positionsData
        .filter(pos => pos.status === 'active').length;

      setStats({
        totalStaked,
        totalRewards,
        activePositions,
        totalValue: totalStaked + totalRewards
      });
    } catch (error) {
      console.error('Error loading staking positions:', error);
      toast.error('Erro ao carregar posições de staking');
    }
  }, []);

  const executeStaking = useCallback(async (
    protocolId: string,
    amount: string,
    walletAddress: string
  ): Promise<StakingTransaction> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const protocol = protocols.find(p => p.id === protocolId);
      if (!protocol) throw new Error('Protocol not found');

      // Call Tatum API for staking transaction
      const { data: tatumResponse, error: tatumError } = await supabase.functions.invoke('tatum-staking', {
        body: {
          action: 'stake',
          protocol: protocol.contract_address,
          network: protocol.network,
          amount,
          walletAddress,
          abi: protocol.abi
        }
      });

      if (tatumError) throw new Error(tatumError.message);

      // Create staking transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from('staking_transactions')
        .insert({
          user_id: user.id,
          hash: tatumResponse.txHash,
          type: 'stake' as const,
          amount: Number(amount),
          status: 'pending' as const,
          gas_used: tatumResponse.gasUsed,
          gas_fee: tatumResponse.gasFee
        })
        .select()
        .single();

      if (transactionError) throw new Error(transactionError.message);

      // Create staking position record
      const { error: positionError } = await supabase
        .from('staking_positions')
        .insert({
          user_id: user.id,
          protocol_id: protocolId,
          wallet_address: walletAddress,
          staked_amount: Number(amount),
          rewards_earned: 0,
          transaction_hash: tatumResponse.txHash,
          status: 'pending' as const
        });

      if (positionError) throw new Error(positionError.message);

      toast.success(`Staking de ${amount} ${protocol.token} iniciado!`);
      
      // Reload data
      setTimeout(() => {
        loadPositions();
      }, 2000);
      
      return {
        ...transactionData,
        amount: Number(transactionData.amount)
      } as StakingTransaction;
    } catch (error: any) {
      console.error('Error executing staking:', error);
      toast.error(`Erro no staking: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [protocols, loadPositions]);

  const unstake = useCallback(async (
    positionId: string,
    amount: string
  ): Promise<StakingTransaction> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const position = positions.find(p => p.id === positionId);
      if (!position) throw new Error('Position not found');

      const protocol = protocols.find(p => p.id === position.protocol_id);
      if (!protocol) throw new Error('Protocol not found');

      // Call Tatum API for unstaking
      const { data: tatumResponse, error: tatumError } = await supabase.functions.invoke('tatum-staking', {
        body: {
          action: 'unstake',
          protocol: protocol.contract_address,
          network: protocol.network,
          amount,
          walletAddress: position.wallet_address,
          abi: protocol.abi
        }
      });

      if (tatumError) throw new Error(tatumError.message);

      // Create transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from('staking_transactions')
        .insert({
          user_id: user.id,
          position_id: positionId,
          hash: tatumResponse.txHash,
          type: 'unstake' as const,
          amount: Number(amount),
          status: 'pending' as const,
          gas_used: tatumResponse.gasUsed,
          gas_fee: tatumResponse.gasFee
        })
        .select()
        .single();

      if (transactionError) throw new Error(transactionError.message);

      // Update position status
      const { error: updateError } = await supabase
        .from('staking_positions')
        .update({ status: 'unstaking' as const })
        .eq('id', positionId);

      if (updateError) throw new Error(updateError.message);

      toast.success(`Unstaking de ${amount} ${protocol.token} iniciado!`);
      
      // Reload data
      setTimeout(() => {
        loadPositions();
      }, 2000);
      
      return {
        ...transactionData,
        amount: Number(transactionData.amount)
      } as StakingTransaction;
    } catch (error: any) {
      console.error('Error executing unstaking:', error);
      toast.error(`Erro no unstaking: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [positions, protocols, loadPositions]);

  const claimRewards = useCallback(async (positionId: string): Promise<StakingTransaction> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const position = positions.find(p => p.id === positionId);
      if (!position) throw new Error('Position not found');

      const protocol = protocols.find(p => p.id === position.protocol_id);
      if (!protocol) throw new Error('Protocol not found');

      // Call Tatum API for claiming rewards
      const { data: tatumResponse, error: tatumError } = await supabase.functions.invoke('tatum-staking', {
        body: {
          action: 'claim',
          protocol: protocol.contract_address,
          network: protocol.network,
          walletAddress: position.wallet_address,
          abi: protocol.abi
        }
      });

      if (tatumError) throw new Error(tatumError.message);

      // Create transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from('staking_transactions')
        .insert({
          user_id: user.id,
          position_id: positionId,
          hash: tatumResponse.txHash,
          type: 'claim' as const,
          amount: position.rewards_earned,
          status: 'pending' as const,
          gas_used: tatumResponse.gasUsed,
          gas_fee: tatumResponse.gasFee
        })
        .select()
        .single();

      if (transactionError) throw new Error(transactionError.message);

      // Create reward record
      const { error: rewardError } = await supabase
        .from('staking_rewards')
        .insert({
          position_id: positionId,
          amount: position.rewards_earned,
          claimed: false,
          transaction_hash: tatumResponse.txHash
        });

      if (rewardError) throw new Error(rewardError.message);

      toast.success('Claim de recompensas iniciado!');
      
      // Reload data
      setTimeout(() => {
        loadPositions();
      }, 2000);
      
      return {
        ...transactionData,
        amount: Number(transactionData.amount)
      } as StakingTransaction;
    } catch (error: any) {
      console.error('Error claiming rewards:', error);
      toast.error(`Erro no claim: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [positions, protocols, loadPositions]);

  // Auto-load data on mount
  useEffect(() => {
    loadProtocols();
  }, [loadProtocols]);

  return {
    protocols,
    positions,
    stats,
    isLoading,
    loadProtocols,
    loadPositions,
    executeStaking,
    unstake,
    claimRewards
  };
};
