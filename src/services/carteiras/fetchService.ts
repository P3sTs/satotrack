
import { CarteiraBTC } from '../../types/types';
import { supabase } from '../../integrations/supabase/client';
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
