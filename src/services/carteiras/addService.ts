
import { CarteiraBTC } from '../../types/types';
import { fetchCarteiraDados, validarEnderecoBitcoin } from '../api';
import { supabase } from '../../integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

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
