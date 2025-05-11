
import { supabase } from '../integrations/supabase/client';
import { CarteiraBTC, TransacaoBTC } from '../types/types';
import { toast } from '@/components/ui/use-toast';

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
    console.log(`Buscando dados para carteira ${endereco}${wallet_id ? ` (ID: ${wallet_id})` : ''}`);
    
    // Indicar extração de dados em andamento
    if (wallet_id) {
      // Atualizar timestamp de tentativa de atualização no banco
      await supabase
        .from('bitcoin_wallets')
        .update({ 
          last_update_attempt: new Date().toISOString() 
        })
        .eq('id', wallet_id);
    }
    
    // Chamar a edge function para buscar dados atualizados
    const { data, error } = await supabase.functions.invoke('fetch-wallet-data', {
      body: { address: endereco, wallet_id },
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (error) {
      console.error('Erro na Edge Function:', error);
      toast.error(`Erro ao buscar dados da blockchain: ${error.message}`);
      throw new Error(`Erro ao conectar com as APIs blockchain: ${error.message}`);
    }

    if (!data) {
      const errorMsg = 'Não foi possível obter dados do endereço Bitcoin';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    console.log('Dados obtidos com sucesso:', data);
    
    // Atualizar timestamp da última atualização bem-sucedida
    if (wallet_id) {
      await supabase
        .from('bitcoin_wallets')
        .update({ 
          last_successful_update: new Date().toISOString() 
        })
        .eq('id', wallet_id);
    }
    
    return {
      saldo: data.balance,
      total_entradas: data.total_received,
      total_saidas: data.total_sent,
      qtde_transacoes: data.transaction_count,
      ultimo_update: data.last_updated
    };
  } catch (error) {
    console.error('Erro ao buscar dados da carteira:', error);
    
    // Verificar se já existe uma carteira no banco, em caso de erro na API
    if (wallet_id) {
      try {
        console.log('Tentando buscar dados existentes do banco...');
        const { data: existingWallet } = await supabase
          .from('bitcoin_wallets')
          .select('balance, total_received, total_sent, transaction_count, last_updated, last_successful_update')
          .eq('id', wallet_id)
          .maybeSingle();
          
        if (existingWallet) {
          console.log('Usando dados existentes do banco:', existingWallet);
          toast.warning(`Usando dados offline (última atualização: ${new Date(existingWallet.last_successful_update || existingWallet.last_updated).toLocaleString()})`);
          
          return {
            saldo: Number(existingWallet.balance),
            total_entradas: Number(existingWallet.total_received),
            total_saidas: Number(existingWallet.total_sent),
            qtde_transacoes: existingWallet.transaction_count,
            ultimo_update: existingWallet.last_updated
          };
        }
      } catch (dbError) {
        console.error('Erro ao buscar dados do banco:', dbError);
      }
    }
    
    toast.error('Erro ao conectar com as APIs blockchain');
    throw new Error('Erro ao conectar com as APIs blockchain');
  }
}

// Função para buscar transações da carteira
export async function fetchTransacoes(wallet_id: string): Promise<TransacaoBTC[]> {
  try {
    console.log(`Buscando transações para carteira ID: ${wallet_id}`);
    
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet_id)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar histórico de transações');
      throw error;
    }

    console.log(`${data.length} transações encontradas`);
    
    return data.map(tx => ({
      hash: tx.hash,
      valor: tx.amount,
      tipo: tx.transaction_type as 'entrada' | 'saida',
      data: tx.transaction_date
    }));
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    toast.error('Erro ao buscar histórico de transações');
    throw new Error('Erro ao buscar histórico de transações');
  }
}

// Função para atualizar dados de uma carteira específica via cron
export async function atualizarDadosCron(wallet_id: string): Promise<void> {
  try {
    console.log(`Atualizando dados da carteira ${wallet_id} via cron job`);
    
    // Buscar o endereço da carteira
    const { data: wallet, error } = await supabase
      .from('bitcoin_wallets')
      .select('address')
      .eq('id', wallet_id)
      .single();

    if (error) {
      console.error('Erro ao buscar carteira:', error);
      throw new Error(`Erro ao buscar carteira: ${error.message}`);
    }

    if (wallet) {
      console.log(`Carteira encontrada, endereço: ${wallet.address}, atualizando dados...`);
      await fetchCarteiraDados(wallet.address, wallet_id);
      console.log('Dados atualizados com sucesso');
    } else {
      console.error('Carteira não encontrada');
    }
  } catch (error) {
    console.error('Erro na atualização periódica da carteira:', error);
    throw error;
  }
}
