
import { CarteiraBTC } from '../../types/types';
import { fetchCarteiraDados } from '../api';
import { toast } from '@/components/ui/sonner';

/**
 * Updates a wallet with fresh data from the blockchain
 */
export const updateCarteira = async (carteira: CarteiraBTC): Promise<CarteiraBTC> => {
  try {
    // Chamar edge function para atualizar dados na blockchain
    const dados = await fetchCarteiraDados(carteira.endereco, carteira.id);
    
    // Retornar carteira atualizada
    const carteiraAtualizada: CarteiraBTC = {
      ...carteira,
      saldo: dados.saldo!,
      ultimo_update: new Date().toISOString(),
      total_entradas: dados.total_entradas!,
      total_saidas: dados.total_saidas!,
      qtde_transacoes: dados.qtde_transacoes!
    };
    
    toast.success(`Dados da carteira "${carteira.nome}" atualizados!`);
    return carteiraAtualizada;
  } catch (error) {
    toast.error('Erro ao atualizar carteira: ' + (error instanceof Error ? error.message : String(error)));
    throw error;
  }
};
