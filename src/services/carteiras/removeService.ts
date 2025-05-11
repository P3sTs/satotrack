
import { supabase } from '../../integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

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
