
import { supabase } from '../../integrations/supabase/client';
import { TransacaoBTC } from '../../types/types';
import { toast } from '@/components/ui/sonner';

/**
 * Loads transactions for a specific wallet
 */
export const loadTransacoes = async (walletId: string): Promise<TransacaoBTC[]> => {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First check if the wallet belongs to the user
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select('id')
      .eq('id', walletId)
      .eq('user_id', user.id)
      .single();
      
    if (walletError || !wallet) {
      console.error('Wallet not found or access denied');
      throw new Error('Acesso negado: Esta carteira não pertence ao usuário atual');
    }

    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }

    return data.map(tx => ({
      hash: tx.hash,
      txid: tx.hash, // Using hash as txid for compatibility
      valor: tx.amount,
      tipo: tx.transaction_type as 'entrada' | 'saida',
      data: tx.transaction_date,
      endereco: tx.hash.substring(0, 12) + '...' // Placeholder
    }));
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    toast.error('Erro ao carregar transações');
    return [];
  }
};
