
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
  created_at?: string;
  user_id?: string;
  xpub?: string;
  private_key_encrypted?: string;
}

interface GenerationResult {
  walletsGenerated: number;
  errors: string[];
}

export const useCryptoWallets = () => {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const loadWallets = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Loading wallets for user:', user.id);
      
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar carteiras:', error);
        toast.error('Erro ao carregar carteiras');
        return;
      }

      console.log('Carteiras carregadas do banco:', data);
      
      // Map database response to CryptoWallet interface
      const mappedWallets: CryptoWallet[] = (data || []).map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        address: wallet.address,
        currency: wallet.currency || wallet.name?.split(' ')[0] || 'UNKNOWN',
        balance: wallet.balance?.toString() || '0',
        created_at: wallet.created_at,
        user_id: wallet.user_id,
        xpub: wallet.xpub,
        private_key_encrypted: wallet.private_key_encrypted
      }));
      
      console.log('Carteiras mapeadas:', mappedWallets);
      setWallets(mappedWallets);
    } catch (error) {
      console.error('Erro ao carregar carteiras:', error);
      toast.error('Erro ao carregar carteiras');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateWallets = useCallback(async (): Promise<GenerationResult | null> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setIsGenerating(true);
    try {
      console.log('Iniciando geração de carteiras para usuário:', user.id);
      
      const { data, error } = await supabase.functions.invoke('generate-crypto-wallets', {
        body: { userId: user.id },
      });

      if (error) {
        console.error('Erro na geração de carteiras:', error);
        toast.error(`Erro na geração: ${error.message}`);
        return { walletsGenerated: 0, errors: [error.message] };
      }

      console.log('Resultado da geração de carteiras:', data);
      
      if (data?.wallets && data.wallets.length > 0) {
        toast.success(`${data.wallets.length} carteiras geradas com sucesso!`);
        
        // Recarregar carteiras imediatamente após geração
        setTimeout(() => {
          loadWallets();
        }, 1000);
      } else {
        console.warn('Nenhuma carteira foi gerada:', data);
        toast.warning('Nenhuma carteira foi gerada. Verifique os logs.');
      }
      
      return {
        walletsGenerated: data?.wallets?.length || 0,
        errors: data?.error ? [data.error] : []
      };
    } catch (error) {
      console.error('Erro na geração de carteiras:', error);
      const errorMessage = error.message || 'Erro desconhecido na geração';
      toast.error(`Falha na geração: ${errorMessage}`);
      return { walletsGenerated: 0, errors: [errorMessage] };
    } finally {
      setIsGenerating(false);
    }
  }, [user, loadWallets]);

  const refreshAllBalances = useCallback(async () => {
    if (!user || wallets.length === 0) return;
    
    setIsLoading(true);
    try {
      toast.info('Atualizando saldos...');
      await loadWallets();
    } finally {
      setIsLoading(false);
    }
  }, [user, wallets.length, loadWallets]);

  // Computed values
  const hasGeneratedWallets = wallets.some(w => w.address !== 'pending_generation');
  const hasPendingWallets = wallets.some(w => w.address === 'pending_generation');

  // Auto-load wallets when user changes
  useEffect(() => {
    if (user) {
      console.log('User changed, loading wallets...');
      loadWallets();
    }
  }, [user, loadWallets]);

  return {
    wallets,
    isLoading,
    isGenerating,
    hasGeneratedWallets,
    hasPendingWallets,
    generateWallets,
    refreshAllBalances,
    loadWallets
  };
};
