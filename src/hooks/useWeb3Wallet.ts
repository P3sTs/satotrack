
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Web3Wallet {
  id: string;
  name: string;
  address: string;
  network: string;
  balance: string;
  privateKey?: string;
  xpub?: string;
}

export interface Web3Transaction {
  txId: string;
  from: string;
  to: string;
  amount: string;
  network: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  blockNumber?: number;
}

export const useWeb3Wallet = () => {
  const [wallets, setWallets] = useState<Web3Wallet[]>([]);
  const [transactions, setTransactions] = useState<Web3Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const callTatumAPI = useCallback(async (payload: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await supabase.functions.invoke('tatum-wallet-api', {
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

  const createWallet = useCallback(async (network: string, name?: string): Promise<Web3Wallet> => {
    setIsLoading(true);
    try {
      console.log(`Creating ${network} wallet...`);
      
      const result = await callTatumAPI({
        action: 'create_wallet',
        network
      });

      const newWallet: Web3Wallet = {
        id: `${network}-${Date.now()}`,
        name: name || `${network} Wallet`,
        address: result.address,
        network: network,
        balance: '0',
        privateKey: result.privateKey,
        xpub: result.xpub
      };

      setWallets(prev => [...prev, newWallet]);
      
      toast.success(`${network} wallet created successfully!`);
      console.log('New wallet created:', newWallet);
      
      return newWallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error(`Failed to create ${network} wallet: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callTatumAPI]);

  const getBalance = useCallback(async (wallet: Web3Wallet): Promise<string> => {
    try {
      console.log(`Getting balance for ${wallet.network} wallet: ${wallet.address}`);
      
      const result = await callTatumAPI({
        action: 'get_balance',
        network: wallet.network,
        address: wallet.address
      });

      const balance = result.balance || '0';
      
      // Update wallet in state
      setWallets(prev => prev.map(w => 
        w.id === wallet.id ? { ...w, balance } : w
      ));

      console.log(`Balance updated for ${wallet.address}: ${balance}`);
      return balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      toast.error(`Failed to get balance: ${error.message}`);
      throw error;
    }
  }, [callTatumAPI]);

  const getTransactions = useCallback(async (wallet: Web3Wallet): Promise<Web3Transaction[]> => {
    try {
      console.log(`Getting transactions for ${wallet.network} wallet: ${wallet.address}`);
      
      const result = await callTatumAPI({
        action: 'get_transactions',
        network: wallet.network,
        address: wallet.address
      });

      const txs: Web3Transaction[] = (result.transactions || []).map((tx: any) => ({
        txId: tx.hash || tx.txid,
        from: tx.from || 'Unknown',
        to: tx.to || 'Unknown',
        amount: tx.value || tx.amount || '0',
        network: wallet.network,
        status: tx.confirmations > 0 ? 'confirmed' : 'pending',
        timestamp: tx.time || tx.blockTime || Date.now(),
        blockNumber: tx.blockNumber
      }));

      setTransactions(prev => [...prev.filter(t => t.network !== wallet.network), ...txs]);
      return txs;
    } catch (error) {
      console.error('Error getting transactions:', error);
      toast.error(`Failed to get transactions: ${error.message}`);
      throw error;
    }
  }, [callTatumAPI]);

  const sendTransaction = useCallback(async (
    wallet: Web3Wallet, 
    recipient: string, 
    amount: string, 
    memo?: string
  ): Promise<Web3Transaction> => {
    if (!wallet.privateKey) {
      throw new Error('Private key not available for this wallet');
    }

    setIsLoading(true);
    try {
      console.log(`Sending ${amount} ${wallet.network} from ${wallet.address} to ${recipient}`);
      
      const result = await callTatumAPI({
        action: 'send_transaction',
        network: wallet.network,
        address: wallet.address,
        privateKey: wallet.privateKey,
        recipient,
        amount,
        memo
      });

      const transaction: Web3Transaction = {
        txId: result.txId,
        from: wallet.address,
        to: recipient,
        amount,
        network: wallet.network,
        status: 'pending',
        timestamp: Date.now()
      };

      setTransactions(prev => [transaction, ...prev]);
      
      toast.success(`Transaction sent! TX ID: ${result.txId.slice(0, 10)}...`);
      console.log('Transaction sent:', transaction);
      
      // Refresh balance after transaction
      setTimeout(() => getBalance(wallet), 2000);
      
      return transaction;
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error(`Transaction failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callTatumAPI, getBalance]);

  const refreshAllWallets = useCallback(async () => {
    if (wallets.length === 0) return;
    
    setIsLoading(true);
    try {
      await Promise.all(wallets.map(wallet => 
        getBalance(wallet).catch(err => console.error(`Failed to refresh ${wallet.address}:`, err))
      ));
    } finally {
      setIsLoading(false);
    }
  }, [wallets, getBalance]);

  return {
    wallets,
    transactions,
    isLoading,
    createWallet,
    getBalance,
    getTransactions,
    sendTransaction,
    refreshAllWallets
  };
};
