
import { CarteiraBTC } from '../../types/types';
import { detectAddressNetwork } from '../crypto/addressDetector';
import { saveMultiChainWallet, fetchWalletData } from '../crypto/multiChainService';
import { toast } from '@/components/ui/sonner';

/**
 * Adds a new multi-chain wallet to the database
 */
export const addCarteira = async (nome: string, endereco: string): Promise<CarteiraBTC> => {
  console.log('🚀 Iniciando adição de carteira:', { nome, endereco });
  
  // Detectar automaticamente o tipo de endereço
  const detectedAddress = detectAddressNetwork(endereco);
  
  if (!detectedAddress) {
    const errorMsg = 'Endereço de criptomoeda não reconhecido. Verifique se é um endereço válido de Bitcoin, Ethereum, Solana, BSC, Polygon, etc.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  console.log('✅ Endereço detectado:', detectedAddress);

  try {
    // Buscar dados atualizados da carteira
    console.log('📡 Buscando dados da carteira...');
    const walletData = await fetchWalletData(detectedAddress);
    console.log('📊 Dados recebidos:', walletData);
    
    // Salvar carteira no banco usando o novo sistema multi-chain
    console.log('💾 Salvando carteira no banco...');
    const novaCarteira = await saveMultiChainWallet(nome, detectedAddress, walletData);
    console.log('✅ Carteira salva:', novaCarteira);
    
    // Retornar a nova carteira formatada para compatibilidade
    const carteiraFormatada: CarteiraBTC = {
      id: novaCarteira.id,
      nome: novaCarteira.name,
      endereco: novaCarteira.address,
      saldo: Number(novaCarteira.balance),
      ultimo_update: novaCarteira.last_updated,
      total_entradas: Number(novaCarteira.total_received || 0),
      total_saidas: Number(novaCarteira.total_sent || 0),
      qtde_transacoes: novaCarteira.transaction_count,
      // Campos extras para multi-chain
      network: novaCarteira.blockchain_networks,
      addressType: novaCarteira.address_type,
      nativeTokenBalance: Number(novaCarteira.native_token_balance || 0),
      tokensData: novaCarteira.tokens_data || []
    };
    
    console.log('🎉 Carteira formatada e pronta:', carteiraFormatada);
    return carteiraFormatada;
    
  } catch (error) {
    console.error('❌ Erro ao adicionar carteira:', error);
    
    if (error instanceof Error) {
      // Tratar erros específicos
      if (error.message.includes('constraint')) {
        throw new Error('Este endereço já foi adicionado ou não é válido para nossa plataforma.');
      }
      if (error.message.includes('network')) {
        throw new Error('Erro de conectividade. Verifique sua conexão e tente novamente.');
      }
      throw error;
    } else {
      const errorMessage = typeof error === 'object' && error !== null 
        ? JSON.stringify(error)
        : 'Erro desconhecido ao adicionar carteira';
      throw new Error(errorMessage);
    }
  }
};
