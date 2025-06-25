
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

  const callAPI = useCallback(async (payload: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await supabase.functions.invoke('crypto-wallet-manager', {
      body: payload,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || 'API call failed');
    }

    return response.data;
  }, []);

  const loadWallets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('id, user_id, name, address, network_id, balance, created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform database records to match CryptoWallet interface
      const transformedWallets = (data || []).map(wallet => ({
        id: wallet.id,
        user_id: wallet.user_id,
        name: wallet.name,
        address: wallet.address,
        network_id: wallet.network_id,
        balance: wallet.balance?.toString() || '0',
        created_at: wallet.created_at
      }));

      setWallets(transformedWallets);
    } catch (error) {
      console.error('Error loading wallets:', error);
      toast.error('Erro ao carregar carteiras');
    }
  }, []);

  const generateWallets = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Generating crypto wallets...');
      
      const result = await callAPI({
        action: 'generate_wallets'
      });

      console.log('Wallets generated:', result);
      await loadWallets();
      
      toast.success('Carteiras cripto geradas com sucesso!');
    } catch (error) {
      console.error('Error generating wallets:', error);
      toast.error(`Erro ao gerar carteiras: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [callAPI, loadWallets]);

  const getBalance = useCallback(async (wallet: CryptoWallet): Promise<string> => {
    try {
      // For now, we'll get the network name from the wallet name or use a mapping
      const networkMapping: { [key: string]: string } = {
        'Bitcoin': 'BTC',
        'Ethereum': 'ETH',
        'Polygon': 'MATIC',
        'Tether': 'USDT',
        'Solana': 'SOL'
      };

      const currency = networkMapping[wallet.name] || wallet.name;

      const result = await callAPI({
        action: 'get_balance',
        currency
      });

      // Update wallet balance in state
      setWallets(prev => prev.map(w => 
        w.id === wallet.id ? { ...w, balance: result.balance } : w
      ));

      return result.balance || '0';
    } catch (error) {
      console.error(`Error getting balance for ${wallet.name}:`, error);
      return '0';
    }
  }, [callAPI]);

  const getTransactions = useCallback(async (wallet: CryptoWallet): Promise<CryptoTransaction[]> => {
    try {
      const networkMapping: { [key: string]: string } = {
        'Bitcoin': 'BTC',
        'Ethereum': 'ETH',
        'Polygon': 'MATIC',
        'Tether': 'USDT',
        'Solana': 'SOL'
      };

      const currency = networkMapping[wallet.name] || wallet.name;

      const result = await callAPI({
        action: 'get_transactions',
        currency
      });

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
      await Promise.all(
        wallets.map(wallet => 
          getBalance(wallet).catch(err => 
            console.error(`Failed to refresh balance for ${wallet.name}:`, err)
          )
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [wallets, getBalance]);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  return {
    wallets,
    transactions,
    isLoading,
    generateWallets,
    loadWallets,
    getBalance,
    getTransactions,
    refreshAllBalances
  };
};
