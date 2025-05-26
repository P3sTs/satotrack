
import { supabase } from '../../integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

/**
 * Updates the name of a wallet
 */
export const updateWalletName = async (id: string, name: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('crypto_wallets')
      .update({ name })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Nome da carteira atualizado com sucesso');
  } catch (error) {
    toast.error('Erro ao atualizar nome da carteira: ' + (error instanceof Error ? error.message : String(error)));
    throw error;
  }
};
