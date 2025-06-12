import { CarteiraBTC, TransacaoBTC } from '../../types/CarteirasTypes';
import { supabase } from '@/integrations/supabase/client';
import { addCarteira } from '../../../services/carteiras/addService';
import { updateMultiChainWallet } from '../../../services/crypto/multiChainService';

/**
 * Load all wallets based on sort options
 */
export const loadUserWallets = async (
  sortOption: string,
  sortDirection: string,
  isAuthenticated: boolean
): Promise<CarteiraBTC[]> => {
  if (!isAuthenticated) {
    console.log('User not authenticated, returning empty array');
    return [];
  }

  try {
    console.log('Loading user wallets...');
    
    const { data, error } = await supabase
      .from('crypto_wallets')
      .select(`
        *,
        blockchain_networks (
          name,
          symbol,
          chain_id,
          explorer_url
        )
      `)
      .order(sortOption === 'nome' ? 'name' : sortOption === 'saldo' ? 'balance' : 'created_at', 
             { ascending: sortDirection === 'asc' });

    if (error) {
      console.error('Error loading wallets:', error);
      throw error;
    }

    const carteiras: CarteiraBTC[] = (data || []).map(wallet => ({
      id: wallet.id,
      nome: wallet.name,
      endereco: wallet.address,
      saldo: Number(wallet.balance || 0),
      ultimo_update: wallet.last_updated,
      total_entradas: Number(wallet.total_received || 0),
      total_saidas: Number(wallet.total_sent || 0),
      qtde_transacoes: wallet.transaction_count || 0,
      network: wallet.blockchain_networks,
      addressType: wallet.address_type,
      nativeTokenBalance: Number(wallet.native_token_balance || 0),
      tokensData: Array.isArray(wallet.tokens_data) ? wallet.tokens_data : []
    }));

    console.log(`Loaded ${carteiras.length} wallets`);
    return carteiras;
  } catch (error) {
    console.error('Error in loadUserWallets:', error);
    return [];
  }
};

/**
 * Add a new wallet
 */
export const addNewWallet = async (
  nome: string, 
  endereco: string, 
  isAuthenticated: boolean,
  currency?: string
): Promise<CarteiraBTC> => {
  if (!isAuthenticated) {
    throw new Error('User not authenticated');
  }

  return await addCarteira(nome, endereco, currency);
};

/**
 * Update wallet data
 */
export const updateWalletData = async (
  carteira: CarteiraBTC, 
  isAuthenticated: boolean
): Promise<CarteiraBTC> => {
  if (!isAuthenticated) {
    throw new Error('User not authenticated');
  }

  console.log('🔄 Updating wallet data for:', carteira.id);

  try {
    // Atualizar via edge function para buscar dados frescos
    const { data: walletData, error: fetchError } = await supabase.functions.invoke('fetch-wallet-data', {
      body: {
        address: carteira.endereco,
        wallet_id: carteira.id,
        currency: carteira.network?.symbol?.toLowerCase() || 'btc'
      }
    });

    if (fetchError) {
      console.warn('⚠️ Erro ao buscar dados via API:', fetchError);
    }

    // Atualizar dados no banco
    const { data: updatedWallet, error: updateError } = await supabase
      .from('crypto_wallets')
      .update({
        balance: walletData?.balance || carteira.saldo,
        total_received: walletData?.total_received || carteira.total_entradas,
        total_sent: walletData?.total_sent || carteira.total_saidas,
        transaction_count: walletData?.transaction_count || carteira.qtde_transacoes,
        last_updated: new Date().toISOString()
      })
      .eq('id', carteira.id)
      .select(`
        *,
        blockchain_networks (
          name,
          symbol,
          chain_id,
          explorer_url
        )
      `)
      .single();

    if (updateError) {
      throw updateError;
    }

    // Retornar carteira atualizada
    return {
      id: updatedWallet.id,
      nome: updatedWallet.name,
      endereco: updatedWallet.address,
      saldo: Number(updatedWallet.balance || 0),
      ultimo_update: updatedWallet.last_updated,
      total_entradas: Number(updatedWallet.total_received || 0),
      total_saidas: Number(updatedWallet.total_sent || 0),
      qtde_transacoes: updatedWallet.transaction_count || 0,
      network: updatedWallet.blockchain_networks,
      addressType: updatedWallet.address_type,
      nativeTokenBalance: Number(updatedWallet.native_token_balance || 0),
      tokensData: Array.isArray(updatedWallet.tokens_data) ? updatedWallet.tokens_data : []
    };

  } catch (error) {
    console.error('Error updating wallet:', error);
    throw error;
  }
};

/**
 * Load transactions for a wallet
 */
export const loadWalletTransactions = async (
  walletId: string, 
  isAuthenticated: boolean
): Promise<TransacaoBTC[]> => {
  if (!isAuthenticated) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('transaction_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(tx => ({
      id: tx.id,
      hash: tx.hash,
      valor: Number(tx.amount),
      data: tx.transaction_date,
      tipo: tx.transaction_type as ('entrada' | 'saida'),
      confirmacoes: 6, // Default value
      taxa: 0 // Default value
    }));
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

/**
 * Remove a wallet
 */
export const removeUserWallet = async (
  id: string, 
  isAuthenticated: boolean
): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('crypto_wallets')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Update wallet name
 */
export const updateWalletNameOp = async (
  id: string, 
  nome: string, 
  isAuthenticated: boolean
): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('crypto_wallets')
    .update({ name: nome })
    .eq('id', id);

  if (error) throw error;
};
