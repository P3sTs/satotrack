
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StakingProtocol, StakingPosition, StakingTransaction } from '@/types/staking';

export const useStaking = () => {
  const [protocols, setProtocols] = useState<StakingProtocol[]>([]);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Protocolos de staking pré-configurados
  const defaultProtocols: StakingProtocol[] = [
    {
      id: 'lido-eth',
      name: 'Lido Staked ETH',
      network: 'ethereum',
      contractAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      abi: [], // ABI do Lido seria carregada aqui
      token: 'ETH',
      apy: 4.2,
      minAmount: '0.01',
      isActive: true
    },
    {
      id: 'polygon-validator',
      name: 'Polygon Staking',
      network: 'polygon',
      contractAddress: '0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908',
      abi: [], // ABI do Polygon seria carregada aqui
      token: 'MATIC',
      apy: 12.3,
      minAmount: '10',
      isActive: true
    }
  ];

  const loadProtocols = useCallback(async () => {
    try {
      // Por enquanto, usar protocolos padrão
      setProtocols(defaultProtocols);
    } catch (error) {
      console.error('Error loading staking protocols:', error);
      toast.error('Erro ao carregar protocolos de staking');
    }
  }, []);

  const loadPositions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simular posições de staking (seria carregado do Supabase)
      const mockPositions: StakingPosition[] = [
        {
          id: '1',
          userId: user.id,
          protocolId: 'lido-eth',
          walletAddress: '0x123...abc',
          stakedAmount: '1.5',
          rewardsEarned: '0.023',
          transactionHash: '0xabc123...',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      setPositions(mockPositions);
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
      const protocol = protocols.find(p => p.id === protocolId);
      if (!protocol) throw new Error('Protocol not found');

      // Chamar Tatum API para executar staking
      const response = await supabase.functions.invoke('tatum-staking', {
        body: {
          action: 'stake',
          protocol: protocol.contractAddress,
          network: protocol.network,
          amount,
          walletAddress,
          abi: protocol.abi
        }
      });

      if (response.error) throw new Error(response.error.message);

      const transaction: StakingTransaction = {
        hash: response.data.txHash,
        type: 'stake',
        amount,
        status: 'pending',
        gasUsed: response.data.gasUsed,
        gasFee: response.data.gasFee
      };

      toast.success(`Staking de ${amount} ${protocol.token} iniciado!`);
      
      // Atualizar posições após staking
      setTimeout(() => loadPositions(), 2000);
      
      return transaction;
    } catch (error) {
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
      const position = positions.find(p => p.id === positionId);
      if (!position) throw new Error('Position not found');

      const protocol = protocols.find(p => p.id === position.protocolId);
      if (!protocol) throw new Error('Protocol not found');

      // Chamar Tatum API para unstaking
      const response = await supabase.functions.invoke('tatum-staking', {
        body: {
          action: 'unstake',
          protocol: protocol.contractAddress,
          network: protocol.network,
          amount,
          walletAddress: position.walletAddress,
          abi: protocol.abi
        }
      });

      if (response.error) throw new Error(response.error.message);

      const transaction: StakingTransaction = {
        hash: response.data.txHash,
        type: 'unstake',
        amount,
        status: 'pending',
        gasUsed: response.data.gasUsed,
        gasFee: response.data.gasFee
      };

      toast.success(`Unstaking de ${amount} ${protocol.token} iniciado!`);
      
      // Atualizar posições após unstaking
      setTimeout(() => loadPositions(), 2000);
      
      return transaction;
    } catch (error) {
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
      const position = positions.find(p => p.id === positionId);
      if (!position) throw new Error('Position not found');

      const protocol = protocols.find(p => p.id === position.protocolId);
      if (!protocol) throw new Error('Protocol not found');

      // Chamar Tatum API para claim rewards
      const response = await supabase.functions.invoke('tatum-staking', {
        body: {
          action: 'claim',
          protocol: protocol.contractAddress,
          network: protocol.network,
          walletAddress: position.walletAddress,
          abi: protocol.abi
        }
      });

      if (response.error) throw new Error(response.error.message);

      const transaction: StakingTransaction = {
        hash: response.data.txHash,
        type: 'claim',
        amount: position.rewardsEarned,
        status: 'pending',
        gasUsed: response.data.gasUsed,
        gasFee: response.data.gasFee
      };

      toast.success('Claim de recompensas iniciado!');
      
      // Atualizar posições após claim
      setTimeout(() => loadPositions(), 2000);
      
      return transaction;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      toast.error(`Erro no claim: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [positions, protocols, loadPositions]);

  return {
    protocols,
    positions,
    isLoading,
    loadProtocols,
    loadPositions,
    executeStaking,
    unstake,
    claimRewards
  };
};
