
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CryptoWallet {
  id: string;
  user_id: string;
  currency: string;
  address: string;
  xpub?: string;
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
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform database records to match CryptoWallet interface
      const transformedWallets = (data || []).map(wallet => ({
        id: wallet.id,
        user_id: wallet.user_id,
        currency: wallet.currency,
        address: wallet.address,
        xpub: wallet.xpub,
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

  const getBalance = useCallback(async (currency: string): Promise<string> => {
    try {
      const result = await callAPI({
        action: 'get_balance',
        currency
      });

      // Update wallet balance in state
      setWallets(prev => prev.map(w => 
        w.currency === currency ? { ...w, balance: result.balance } : w
      ));

      return result.balance || '0';
    } catch (error) {
      console.error(`Error getting ${currency} balance:`, error);
      return '0';
    }
  }, [callAPI]);

  const getTransactions = useCallback(async (currency: string): Promise<CryptoTransaction[]> => {
    try {
      const result = await callAPI({
        action: 'get_transactions',
        currency
      });

      return result.transactions || [];
    } catch (error) {
      console.error(`Error getting ${currency} transactions:`, error);
      return [];
    }
  }, [callAPI]);

  const refreshAllBalances = useCallback(async () => {
    if (wallets.length === 0) return;
    
    setIsLoading(true);
    try {
      const supportedCurrencies = ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL'];
      
      await Promise.all(
        supportedCurrencies.map(currency => 
          getBalance(currency).catch(err => 
            console.error(`Failed to refresh ${currency} balance:`, err)
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
