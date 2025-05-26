
import { supabase } from '../integrations/supabase/client';
import { CarteiraBTC, TransacaoBTC } from '../types/types';
import { toast } from '@/hooks/use-toast';
import { detectAddressNetwork, DetectedAddress } from './crypto/addressDetector';
import { fetchWalletData, saveMultiChainWallet } from './crypto/multiChainService';

// Check if user is authenticated
const checkAuthentication = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
};

// Função para validar endereço Bitcoin - Melhorada para aceitar tanto endereços Legacy quanto SegWit
export function validarEnderecoBitcoin(endereco: string): boolean {
  // Usar o novo detector de endereços
  const detected = detectAddressNetwork(endereco);
  return detected !== null && detected.isValid;
}

// Função universal para validar qualquer endereço de criptomoeda
export function validarEnderecoCrypto(endereco: string): DetectedAddress | null {
  return detectAddressNetwork(endereco);
}

// Buscar dados da carteira usando o novo sistema multi-chain
export async function fetchCarteiraDados(endereco: string, wallet_id?: string): Promise<Partial<CarteiraBTC>> {
  try {
    // Check authentication first
    await checkAuthentication();
    
    // Detectar o tipo de endereço
    const detectedAddress = detectAddressNetwork(endereco);
    
    if (!detectedAddress) {
      throw new Error('Endereço de criptomoeda não reconhecido ou inválido');
    }

    // Buscar dados usando o serviço multi-chain
    const walletData = await fetchWalletData(detectedAddress);

    return {
      saldo: walletData.nativeBalance,
      total_entradas: walletData.nativeBalance, // Para compatibilidade
      total_saidas: 0, // Será calculado conforme necessário
      qtde_transacoes: walletData.transactionCount
    };
  } catch (error) {
    console.error('Erro ao buscar dados da carteira:', error);
    toast({
      title: "Erro",
      description: error instanceof Error ? error.message : 'Erro ao conectar com as APIs blockchain',
      variant: "destructive"
    });
    throw error;
  }
}

// Função para buscar transações da carteira
export async function fetchTransacoes(wallet_id: string): Promise<TransacaoBTC[]> {
  try {
    // Check authentication first
    const user = await checkAuthentication();
    
    // First check if the wallet belongs to the user
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select('id')
      .eq('id', wallet_id)
      .eq('user_id', user.id)
      .single();
      
    if (walletError || !wallet) {
      console.error('Wallet not found or access denied');
      throw new Error('Acesso negado: Esta carteira não pertence ao usuário atual');
    }

    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet_id)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar transações:', error);
      toast({
        title: "Erro",
        description: 'Erro ao buscar histórico de transações',
        variant: "destructive"
      });
      throw error;
    }

    return data.map(tx => ({
      hash: tx.hash,
      txid: tx.hash, // Using hash as txid for compatibility
      valor: tx.amount,
      tipo: tx.transaction_type as 'entrada' | 'saida',
      data: tx.transaction_date,
      endereco: tx.hash.substring(0, 12) + '...' // Placeholder, since we don't have actual address
    }));
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    throw new Error('Erro ao buscar histórico de transações');
  }
}

// Função para atualizar dados de uma carteira específica via cron
export async function atualizarDadosCron(wallet_id: string): Promise<void> {
  try {
    // Check authentication first
    const user = await checkAuthentication();
    
    // Buscar o endereço da carteira
    const { data: wallet, error } = await supabase
      .from('crypto_wallets')
      .select('address')
      .eq('id', wallet_id)
      .eq('user_id', user.id) // Ensure user owns this wallet
      .single();

    if (error) {
      console.error('Erro ao buscar carteira:', error);
      toast({
        title: "Erro",
        description: `Erro ao buscar carteira: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(`Erro ao buscar carteira: ${error.message}`);
    }

    if (wallet) {
      await fetchCarteiraDados(wallet.address, wallet_id);
    }
  } catch (error) {
    console.error('Erro na atualização periódica da carteira:', error);
    throw error;
  }
}
