
import { CarteiraBTC } from '../../types/types';
import { supabase } from '../../integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

/**
 * Loads crypto wallets from the database (updated for multi-chain support)
 */
export const loadCarteiras = async (sortOption: string, sortDirection: string) => {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

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
      .eq('user_id', user.id) // Only fetch wallets belonging to the current user
      .order(sortOption === 'saldo' ? 'balance' : 'last_updated', { ascending: sortDirection === 'asc' });
      
    if (error) {
      throw error;
    }
    
    // Mapear do formato do banco para o formato da aplicação
    const carteirasFormatadas = data.map(c => ({
      id: c.id,
      nome: c.name,
      endereco: c.address,
      saldo: Number(c.balance),
      ultimo_update: c.last_updated,
      total_entradas: Number(c.total_received),
      total_saidas: Number(c.total_sent),
      qtde_transacoes: c.transaction_count,
      // Novos campos para suporte multi-chain
      network: c.blockchain_networks,
      addressType: c.address_type,
      nativeTokenBalance: Number(c.native_token_balance),
      tokensData: c.tokens_data || []
    }));
    
    return carteirasFormatadas;
  } catch (error) {
    console.error('Erro ao carregar carteiras:', error);
    toast.error('Erro ao carregar suas carteiras');
    return [];
  }
};
