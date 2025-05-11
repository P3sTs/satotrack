
import { TransacaoBTC } from '../../types/types';
import { fetchTransacoes } from '../api';
import { toast } from '@/components/ui/sonner';

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
