
import { supabase } from '../../integrations/supabase/client';
import { TransacaoBTC } from '../../types/types';
import { toast } from '@/hooks/use-toast';

/**
 * Loads transactions for a specific wallet with enhanced error handling
 */
export const loadTransacoes = async (walletId: string): Promise<TransacaoBTC[]> => {
  try {
    console.log(`Loading transactions for wallet: ${walletId}`);
    
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First check if the wallet belongs to the user
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select('id, address, name')
      .eq('id', walletId)
      .eq('user_id', user.id)
      .single();
      
    if (walletError || !wallet) {
      console.error('Wallet not found or access denied:', walletError);
      throw new Error('Acesso negado: Esta carteira não pertence ao usuário atual');
    }

    console.log(`Found wallet: ${wallet.name} (${wallet.address})`);

    // Load transactions from database
    const { data: dbTransactions, error: dbError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('transaction_date', { ascending: false })
      .limit(100);

    if (dbError) {
      console.error('Erro ao buscar transações do banco:', dbError);
      throw dbError;
    }

    console.log(`Found ${dbTransactions?.length || 0} transactions in database`);

    // If no transactions in database, try to fetch from API
    if (!dbTransactions || dbTransactions.length === 0) {
      console.log('No transactions found in database, fetching from API...');
      
      try {
        const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-wallet-data', {
          body: {
            address: wallet.address,
            wallet_id: walletId
          }
        });

        if (apiError) {
          console.error('Error fetching from API:', apiError);
        } else if (apiData && apiData.transactions) {
          console.log(`Fetched ${apiData.transactions.length} transactions from API`);
          
          // Reload from database after API update
          const { data: refreshedTransactions } = await supabase
            .from('wallet_transactions')
            .select('*')
            .eq('wallet_id', walletId)
            .order('transaction_date', { ascending: false })
            .limit(100);
            
          if (refreshedTransactions) {
            console.log(`Found ${refreshedTransactions.length} transactions after API refresh`);
            return formatTransactions(refreshedTransactions);
          }
        }
      } catch (apiError) {
        console.error('API fetch failed:', apiError);
        // Continue with empty array if API fails
      }
    }

    return formatTransactions(dbTransactions || []);
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    toast({
      title: "Erro",
      description: error instanceof Error ? error.message : 'Erro ao carregar transações',
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Format database transactions to match the expected interface
 */
function formatTransactions(dbTransactions: any[]): TransacaoBTC[] {
  return dbTransactions.map(tx => ({
    hash: tx.hash,
    txid: tx.hash,
    valor: Number(tx.amount) || 0,
    tipo: tx.transaction_type as 'entrada' | 'saida',
    data: tx.transaction_date,
    endereco: `${tx.hash.substring(0, 8)}...${tx.hash.substring(tx.hash.length - 8)}`,
    confirmations: tx.confirmations || 0,
    fee: tx.fee || 0,
    block_height: tx.block_height || null
  }));
}

/**
 * Force refresh transactions from API
 */
export const refreshTransacoes = async (walletId: string): Promise<TransacaoBTC[]> => {
  try {
    console.log(`Force refreshing transactions for wallet: ${walletId}`);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get wallet info
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select('address')
      .eq('id', walletId)
      .eq('user_id', user.id)
      .single();
      
    if (walletError || !wallet) {
      throw new Error('Carteira não encontrada');
    }

    // Force fetch from API
    const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-wallet-data', {
      body: {
        address: wallet.address,
        wallet_id: walletId
      }
    });

    if (apiError) {
      throw new Error(apiError.message || 'Erro ao buscar dados da API');
    }

    // Reload transactions from database
    return await loadTransacoes(walletId);
  } catch (error) {
    console.error('Erro ao atualizar transações:', error);
    toast({
      title: "Erro",
      description: error instanceof Error ? error.message : 'Erro ao atualizar transações',
      variant: "destructive"
    });
    throw error;
  }
};
