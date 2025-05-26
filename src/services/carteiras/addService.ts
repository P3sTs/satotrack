
import { CarteiraBTC } from '../../types/types';
import { validarEnderecoCrypto, fetchCarteiraDados } from '../api';
import { saveMultiChainWallet, fetchWalletData } from '../crypto/multiChainService';
import { toast } from '@/components/ui/sonner';

/**
 * Adds a new multi-chain wallet to the database
 */
export const addCarteira = async (nome: string, endereco: string): Promise<CarteiraBTC> => {
  // Detectar automaticamente o tipo de endereço
  const detectedAddress = validarEnderecoCrypto(endereco);
  
  if (!detectedAddress) {
    throw new Error('Endereço de criptomoeda não reconhecido. Verifique se é um endereço válido de Bitcoin, Ethereum, Solana, BSC, Polygon, etc.');
  }

  try {
    // Buscar dados atualizados da carteira
    const walletData = await fetchWalletData(detectedAddress);
    
    // Salvar carteira no banco usando o novo sistema multi-chain
    const novaCarteira = await saveMultiChainWallet(nome, detectedAddress, walletData);
    
    // Retornar a nova carteira formatada para compatibilidade
    const carteiraFormatada: CarteiraBTC = {
      id: novaCarteira.id,
      nome: novaCarteira.name,
      endereco: novaCarteira.address,
      saldo: Number(novaCarteira.balance),
      ultimo_update: novaCarteira.last_updated,
      total_entradas: Number(novaCarteira.total_received || 0),
      total_saidas: Number(novaCarteira.total_sent || 0),
      qtde_transacoes: novaCarteira.transaction_count
    };
    
    toast.success(`Carteira ${detectedAddress.network.name} "${nome}" adicionada com sucesso!`);
    return carteiraFormatada;
    
  } catch (error) {
    console.error('Error adding wallet:', error);
    if (error instanceof Error) {
      toast.error(`Erro ao adicionar carteira: ${error.message}`);
      throw error;
    } else {
      const errorMessage = typeof error === 'object' && error !== null 
        ? JSON.stringify(error)
        : 'Erro desconhecido';
      toast.error(`Erro ao adicionar carteira: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }
};
