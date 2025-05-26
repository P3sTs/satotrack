
import { CarteiraBTC } from '../../types/types';
import { updateMultiChainWallet } from '../crypto/multiChainService';
import { toast } from '@/components/ui/sonner';

/**
 * Updates wallet data using the multi-chain service
 */
export const updateCarteira = async (carteira: CarteiraBTC): Promise<CarteiraBTC> => {
  try {
    // Use the multi-chain update service
    const updatedWallet = await updateMultiChainWallet(carteira.id);
    
    // Format the response to match the expected CarteiraBTC interface
    const carteiraFormatada: CarteiraBTC = {
      id: updatedWallet.id,
      nome: updatedWallet.name,
      endereco: updatedWallet.address,
      saldo: Number(updatedWallet.balance),
      ultimo_update: updatedWallet.last_updated,
      total_entradas: Number(updatedWallet.total_received || 0),
      total_saidas: Number(updatedWallet.total_sent || 0),
      qtde_transacoes: updatedWallet.transaction_count || 0,
      // Additional multi-chain fields
      network: updatedWallet.blockchain_networks,
      addressType: updatedWallet.address_type,
      nativeTokenBalance: Number(updatedWallet.native_token_balance || 0),
      tokensData: updatedWallet.tokens_data || []
    };
    
    toast.success('Carteira atualizada com sucesso');
    return carteiraFormatada;
  } catch (error) {
    console.error('Erro ao atualizar carteira:', error);
    toast.error('Erro ao atualizar carteira: ' + (error instanceof Error ? error.message : String(error)));
    throw error;
  }
};
