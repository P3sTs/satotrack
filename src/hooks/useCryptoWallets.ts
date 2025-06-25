
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CryptoWallet {
  id: string;
  user_id: string;
  name: string;
  address: string;
  network_id: string;
  balance?: string;
  created_at: string;
  xpub?: string;
  private_key_encrypted?: string;
}

export interface CryptoTransaction {
  id: string;
  wallet_id: string;
  transaction_hash: string;
  transaction_type: 'send' | 'receive';
  amount: string;
  currency: string;
  from_address: string;
  to_address: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export const useCryptoWallets = () => {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const callAPI = useCallback(async (payload: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    console.log('Calling crypto-wallet-manager API with payload:', payload);

    const response = await supabase.functions.invoke('crypto-wallet-manager', {
      body: payload,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    console.log('API response:', response);

    if (response.error) {
      throw new Error(response.error.message || 'API call failed');
    }

    return response.data;
  }, []);

  const loadWallets = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('id, user_id, name, address, network_id, balance, created_at, xpub, private_key_encrypted')
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('Loaded wallets from database:', data);

      // Transform database records to match CryptoWallet interface
      const transformedWallets = (data || []).map(wallet => ({
        id: wallet.id,
        user_id: wallet.user_id,
        name: wallet.name,
        address: wallet.address,
        network_id: wallet.network_id,
        balance: wallet.balance?.toString() || '0',
        created_at: wallet.created_at,
        xpub: wallet.xpub,
        private_key_encrypted: wallet.private_key_encrypted
      }));

      setWallets(transformedWallets);
    } catch (error) {
      console.error('Error loading wallets:', error);
      toast.error('Erro ao carregar carteiras');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateWallets = useCallback(async () => {
    setIsGenerating(true);
    setIsLoading(true);
    try {
      console.log('Starting wallet generation...');
      
      const result = await callAPI({
        action: 'generate_wallets'
      });

      console.log('Wallets generation result:', result);
      
      // Recarregar carteiras do banco de dados
      await loadWallets();
      
      toast.success('Carteiras cripto geradas com sucesso!');
      return result;
    } catch (error) {
      console.error('Error generating wallets:', error);
      toast.error(`Erro ao gerar carteiras: ${error.message}`);
      throw error;
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  }, [callAPI, loadWallets]);

  const getBalance = useCallback(async (wallet: CryptoWallet): Promise<string> => {
    try {
      console.log(`Getting balance for wallet ${wallet.name} (${wallet.network_id})`);
      
      const result = await callAPI({
        action: 'get_balance',
        currency: wallet.network_id
      });

      console.log(`Balance result for ${wallet.name}:`, result);

      // Update wallet balance in state
      setWallets(prev => prev.map(w => 
        w.id === wallet.id ? { ...w, balance: result.balance || '0' } : w
      ));

      return result.balance || '0';
    } catch (error) {
      console.error(`Error getting balance for ${wallet.name}:`, error);
      return '0';
    }
  }, [callAPI]);

  const getTransactions = useCallback(async (wallet: CryptoWallet): Promise<CryptoTransaction[]> => {
    try {
      console.log(`Getting transactions for wallet ${wallet.name} (${wallet.network_id})`);
      
      const result = await callAPI({
        action: 'get_transactions',
        currency: wallet.network_id
      });

      console.log(`Transactions result for ${wallet.name}:`, result);

      return result.transactions || [];
    } catch (error) {
      console.error(`Error getting transactions for ${wallet.name}:`, error);
      return [];
    }
  }, [callAPI]);

  const refreshAllBalances = useCallback(async () => {
    if (wallets.length === 0) return;
    
    setIsLoading(true);
    try {
      console.log('Refreshing all wallet balances...');
      
      await Promise.all(
        wallets
          .filter(wallet => wallet.address !== 'pending_generation')
          .map(wallet => 
            getBalance(wallet).catch(err => 
              console.error(`Failed to refresh balance for ${wallet.name}:`, err)
            )
          )
      );
      
      toast.success('Saldos atualizados com sucesso!');
    } catch (error) {
      console.error('Error refreshing balances:', error);
      toast.error('Erro ao atualizar saldos');
    } finally {
      setIsLoading(false);
    }
  }, [wallets, getBalance]);

  // Check if wallets are generated (no pending addresses)
  const hasGeneratedWallets = wallets.length > 0 && !wallets.some(w => w.address === 'pending_generation');
  const hasPendingWallets = wallets.some(w => w.address === 'pending_generation');

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  return {
    wallets,
    transactions,
    isLoading,
    isGenerating,
    hasGeneratedWallets,
    hasPendingWallets,
    generateWallets,
    loadWallets,
    getBalance,
    getTransactions,
    refreshAllBalances
  };
};
