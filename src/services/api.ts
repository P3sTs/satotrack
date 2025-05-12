
import { supabase } from '../integrations/supabase/client';
import { CarteiraBTC, TransacaoBTC } from '../types/types';
import { toast } from '@/hooks/use-toast';

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
  // Valida endereços Bitcoin Legacy (1...)
  const legacyRegex = /^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // Valida endereços SegWit (3...)
  const segwitRegex = /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // Valida endereços Bech32 (bc1...)
  const bech32Regex = /^(bc1)[a-zA-HJ-NP-Z0-9]{25,89}$/;
  
  return legacyRegex.test(endereco) || segwitRegex.test(endereco) || bech32Regex.test(endereco);
}

// Buscar dados da carteira diretamente da API blockchain via edge function
export async function fetchCarteiraDados(endereco: string, wallet_id?: string): Promise<Partial<CarteiraBTC>> {
  try {
    // Check authentication first
    await checkAuthentication();
    
    // Chamar a edge function para buscar dados atualizados
    const { data, error } = await supabase.functions.invoke('fetch-wallet-data', {
      body: { address: endereco, wallet_id }
    });

    if (error) {
      console.error('Erro na Edge Function:', error);
      throw new Error(`Erro ao conectar com as APIs blockchain: ${error.message}`);
    }

    if (!data) {
      throw new Error('Não foi possível obter dados do endereço Bitcoin');
    }

    return {
      saldo: data.balance,
      total_entradas: data.total_received,
      total_saidas: data.total_sent,
      qtde_transacoes: data.transaction_count
    };
  } catch (error) {
    console.error('Erro ao buscar dados da carteira:', error);
    toast({
      title: "Erro",
      description: 'Erro ao conectar com as APIs blockchain',
      variant: "destructive"
    });
    throw new Error('Erro ao conectar com as APIs blockchain');
  }
}

// Função para buscar transações da carteira
export async function fetchTransacoes(wallet_id: string): Promise<TransacaoBTC[]> {
  try {
    // Check authentication first
    const user = await checkAuthentication();
    
    // First check if the wallet belongs to the user
    const { data: wallet, error: walletError } = await supabase
      .from('bitcoin_wallets')
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
      .from('bitcoin_wallets')
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
