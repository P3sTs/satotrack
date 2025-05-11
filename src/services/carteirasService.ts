
import { CarteiraBTC, TransacaoBTC } from '../types/types';
import { fetchCarteiraDados, fetchTransacoes, validarEnderecoBitcoin } from './api';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

/**
 * Loads carteiras from the database
 */
export const loadCarteiras = async (sortOption: string, sortDirection: string) => {
  try {
    const { data, error } = await supabase
      .from('bitcoin_wallets')
      .select('*')
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
      qtde_transacoes: c.transaction_count
    }));
    
    return carteirasFormatadas;
  } catch (error) {
    console.error('Erro ao carregar carteiras:', error);
    toast.error('Erro ao carregar suas carteiras');
    return [];
  }
};

/**
 * Adds a new wallet to the database
 */
export const addCarteira = async (nome: string, endereco: string): Promise<CarteiraBTC> => {
  if (!validarEnderecoBitcoin(endereco)) {
    throw new Error('Endereço Bitcoin inválido');
  }

  // Verificar se o endereço já existe para este usuário
  const { data: existingWallet, error: checkError } = await supabase
    .from('bitcoin_wallets')
    .select('id')
    .eq('address', endereco)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking existing wallet:', checkError);
    throw new Error(`Erro ao verificar carteira: ${checkError.message}`);
  }

  if (existingWallet) {
    throw new Error('Este endereço já está sendo monitorado por você');
  }

  try {
    // Buscar dados atualizados da carteira
    const dados = await fetchCarteiraDados(endereco);
    
    // Inserir nova carteira no banco
    const { data, error } = await supabase
      .from('bitcoin_wallets')
      .insert({
        name: nome,
        address: endereco,
        balance: dados.saldo,
        total_received: dados.total_entradas,
        total_sent: dados.total_saidas,
        transaction_count: dados.qtde_transacoes,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting wallet:', error);
      throw new Error(`Erro ao adicionar carteira: ${error.message}`);
    }
    
    // Retornar a nova carteira formatada
    const novaCarteira: CarteiraBTC = {
      id: data.id,
      nome: data.name,
      endereco: data.address,
      saldo: Number(data.balance),
      ultimo_update: data.last_updated,
      total_entradas: Number(data.total_received),
      total_saidas: Number(data.total_sent),
      qtde_transacoes: data.transaction_count
    };
    
    toast.success(`Carteira "${nome}" adicionada com sucesso!`);
    return novaCarteira;
    
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

/**
 * Loads transaction data for a wallet
 */
export const loadTransacoes = async (id: string): Promise<TransacaoBTC[]> => {
  try {
    const txs = await fetchTransacoes(id);
    return txs;
  } catch (error) {
    toast.error('Erro ao carregar transações: ' + (error instanceof Error ? error.message : String(error)));
    return [];
  }
};

/**
 * Removes a wallet from monitoring
 */
export const removeCarteira = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bitcoin_wallets')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.info('Carteira removida do monitoramento');
  } catch (error) {
    toast.error('Erro ao remover carteira: ' + (error instanceof Error ? error.message : String(error)));
    throw error;
  }
};
