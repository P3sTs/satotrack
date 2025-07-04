import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

export interface MultiChainWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
  created_at?: string;
  user_id?: string;
  xpub?: string;
}

interface GenerationResult {
  walletsGenerated: number;
  errors: string[];
  summary: {
    generated: number;
    failed: number;
    total_requested: number;
  };
}

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

// 🌐 Redes suportadas organizadas por categoria
export const NETWORK_CATEGORIES = {
  priority: {
    name: 'Principais',
    networks: ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL', 'AVAX', 'BSC']
  },
  layer2: {
    name: 'Layer 2 & Scaling',
    networks: ['ARBITRUM', 'OP', 'BASE', 'MATIC']
  },
  defi: {
    name: 'DeFi Ecosystems', 
    networks: ['AVAX', 'FTM', 'CELO', 'NEAR']
  },
  enterprise: {
    name: 'Enterprise & Corporate',
    networks: ['XRP', 'XLM', 'VET', 'ALGO']
  },
  alternative: {
    name: 'Alternative Chains',
    networks: ['ADA', 'DOT', 'ATOM', 'XTZ', 'FLOW']
  }
};

export const useMultiChainWallets = () => {
  const [wallets, setWallets] = useState<MultiChainWallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [generationErrors, setGenerationErrors] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadWallets = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Loading multi-chain wallets for user:', user.id);
      
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

      const mappedWallets: MultiChainWallet[] = (data || []).map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        address: wallet.address,
        currency: wallet.currency || wallet.name?.split(' ')[0] || 'UNKNOWN',
        balance: wallet.balance?.toString() || '0',
        created_at: wallet.created_at,
        user_id: wallet.user_id,
        xpub: wallet.xpub,
      }));
      
      setWallets(mappedWallets);

      if (mappedWallets.length > 0) {
        const hasActiveWallets = mappedWallets.some(w => w.address !== 'pending_generation');
        if (hasActiveWallets) {
          setGenerationStatus('success');
        }
      } else {
        setGenerationStatus('idle');
      }
    } catch (error) {
      console.error('Erro ao carregar carteiras:', error);
      toast.error('Erro ao carregar carteiras');
      setGenerationStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateWallets = useCallback(async (
    networks?: string[], 
    generateAll = false
  ): Promise<GenerationResult | null> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setGenerationStatus('generating');
    setGenerationErrors([]);
    
    try {
      console.log('Iniciando geração multi-chain para usuário:', user.id);
      
      const { data, error } = await supabase.functions.invoke('generate-multi-chain-wallets', {
        body: { 
          userId: user.id,
          networks: networks || NETWORK_CATEGORIES.priority.networks,
          generateAll
        },
      });

      if (error) {
        console.error('Erro na geração multi-chain:', error);
        const errorMsg = `Erro na geração: ${error.message}`;
        toast.error(errorMsg);
        setGenerationStatus('error');
        setGenerationErrors([error.message]);
        return { walletsGenerated: 0, errors: [error.message], summary: { generated: 0, failed: 1, total_requested: 0 } };
      }

      console.log('Resultado da geração multi-chain:', data);
      
      if (data?.wallets && Array.isArray(data.wallets) && data.wallets.length > 0) {
        toast.success(`${data.wallets.length} carteiras geradas com sucesso!`);
        setGenerationStatus('success');
        
        // Recarregar carteiras imediatamente
        setTimeout(() => {
          loadWallets();
        }, 1000);

        return {
          walletsGenerated: data.wallets.length,
          errors: data.errors || [],
          summary: data.summary
        };
      } else {
        const warningMsg = 'Nenhuma carteira nova foi gerada';
        toast.warning(warningMsg);
        setGenerationStatus('error');
        setGenerationErrors([warningMsg]);
        return { 
          walletsGenerated: 0, 
          errors: [warningMsg],
          summary: data?.summary || { generated: 0, failed: 1, total_requested: 0 }
        };
      }
    } catch (error) {
      console.error('Erro na geração multi-chain:', error);
      const errorMessage = error.message || 'Erro desconhecido na geração';
      toast.error(`Falha na geração: ${errorMessage}`);
      setGenerationStatus('error');
      setGenerationErrors([errorMessage]);
      return { 
        walletsGenerated: 0, 
        errors: [errorMessage],
        summary: { generated: 0, failed: 1, total_requested: 0 }
      };
    }
  }, [user, loadWallets]);

  const sendTransaction = useCallback(async (
    walletId: string,
    recipient: string,
    amount: string
  ): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');

    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) throw new Error('Carteira não encontrada');

    console.log(`🔒 Enviando ${amount} ${wallet.currency} para ${recipient}`);
    
    // Simular envio via Tatum KMS - implementar integração real
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    throw new Error('🚧 Envio de transações em desenvolvimento - Aguarde integração KMS completa');
  }, [user, wallets]);

  const refreshAllBalances = useCallback(async () => {
    if (!user || wallets.length === 0) return;
    
    setIsLoading(true);
    try {
      toast.info('Atualizando saldos multi-chain...');
      await loadWallets();
    } finally {
      setIsLoading(false);
    }
  }, [user, wallets.length, loadWallets]);

  // Computed values
  const hasGeneratedWallets = wallets.some(w => w.address !== 'pending_generation');
  const hasPendingWallets = wallets.some(w => w.address === 'pending_generation');
  const walletsByNetwork = wallets.reduce((acc, wallet) => {
    acc[wallet.currency] = wallet;
    return acc;
  }, {} as Record<string, MultiChainWallet>);

  // Auto-load wallets when user changes
  useEffect(() => {
    if (user?.id) {
      loadWallets();
    }
  }, [user?.id]);

  return {
    wallets,
    walletsByNetwork,
    isLoading,
    generationStatus,
    generationErrors,
    hasGeneratedWallets,
    hasPendingWallets,
    generateWallets,
    sendTransaction,
    refreshAllBalances,
    loadWallets,
    // Network categories for UI
    NETWORK_CATEGORIES
  };
};