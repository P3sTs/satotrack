
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { logSecurityCompliance, isWalletDataSecure } from '@/utils/security/cryptoSecurity';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
  created_at?: string;
  user_id?: string;
  xpub?: string;
  // ❌ REMOVED: private_key_encrypted - SECURITY COMPLIANCE
}

interface GenerationResult {
  walletsGenerated: number;
  errors: string[];
}

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

export const useCryptoWallets = () => {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [generationErrors, setGenerationErrors] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadWallets = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available for loading wallets');
      setWallets([]);
      setGenerationStatus('idle');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Loading wallets for user:', user.id);
      logSecurityCompliance('WALLET_LOAD_ATTEMPT');
      
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar carteiras:', error);
        toast.error(`Erro ao carregar carteiras: ${error.message}`);
        setGenerationStatus('error');
        return;
      }

      console.log('Carteiras carregadas do banco:', data);
      
      // Map database response to CryptoWallet interface - SECURE MAPPING
      const mappedWallets: CryptoWallet[] = (data || []).map(wallet => {
        // Validate wallet data security before mapping
        if (!isWalletDataSecure(wallet)) {
          console.warn('🔒 Insecure wallet data detected:', wallet.id);
        }
        
        return {
          id: wallet.id,
          name: wallet.name,
          address: wallet.address,
          currency: wallet.currency || wallet.name?.split(' ')[0] || 'UNKNOWN',
          balance: wallet.balance?.toString() || '0',
          created_at: wallet.created_at,
          user_id: wallet.user_id,
          xpub: wallet.xpub,
          // ❌ SECURITY: Never include private_key_encrypted in client mapping
        };
      });
      
      console.log('Carteiras mapeadas com segurança:', mappedWallets);
      setWallets(mappedWallets);
      logSecurityCompliance('WALLET_LOAD_SUCCESS', { count: mappedWallets.length });

      // Update status based on wallets state
      if (mappedWallets.length > 0) {
        const hasActiveWallets = mappedWallets.some(w => w.address !== 'pending_generation');
        if (hasActiveWallets) {
          setGenerationStatus('success');
        }
      } else {
        setGenerationStatus('idle');
      }
    } catch (error) {
      console.error('Erro inesperado ao carregar carteiras:', error);
      toast.error('Erro inesperado ao carregar carteiras');
      setGenerationStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const generateWallets = useCallback(async (): Promise<GenerationResult | null> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    // Verificar se já tem carteiras ativas
    const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
    if (activeWallets.length > 0) {
      toast.info('Você já possui carteiras geradas. Redirecionando...');
      setTimeout(() => navigate('/carteiras'), 1000);
      return { walletsGenerated: activeWallets.length, errors: [] };
    }

    setGenerationStatus('generating');
    setGenerationErrors([]);
    logSecurityCompliance('WALLET_GENERATION_START');
    
    try {
      console.log('Iniciando geração de carteiras para usuário:', user.id);
      
      const { data, error } = await supabase.functions.invoke('generate-crypto-wallets', {
        body: { userId: user.id },
      });

      if (error) {
        console.error('Erro na geração de carteiras:', error);
        const errorMsg = `Erro na geração: ${error.message}`;
        toast.error(errorMsg);
        setGenerationStatus('error');
        setGenerationErrors([error.message]);
        return { walletsGenerated: 0, errors: [error.message] };
      }

      console.log('Resultado da geração de carteiras:', data);
      logSecurityCompliance('WALLET_GENERATION_API_SUCCESS');
      
      // Check if we got wallets or if it's the RLS policy error case
      if (data?.wallets && Array.isArray(data.wallets) && data.wallets.length > 0) {
        toast.success(`${data.wallets.length} carteiras geradas com sucesso!`);
        setGenerationStatus('success');
        logSecurityCompliance('WALLET_GENERATION_COMPLETE');
        
        // Recarregar carteiras imediatamente após geração
        setTimeout(() => {
          loadWallets();
        }, 1000);

        // Redirecionar para a página de carteiras após 2 segundos
        setTimeout(() => {
          navigate('/carteiras');
        }, 2000);
        
        return {
          walletsGenerated: data.wallets.length,
          errors: []
        };
      } else if (data?.message === 'Wallets already exist') {
        // User already has wallets, just load them
        console.log('Usuário já possui carteiras, carregando...');
        setGenerationStatus('success');
        logSecurityCompliance('WALLET_ALREADY_EXISTS');
        setTimeout(() => {
          loadWallets();
          navigate('/carteiras');
        }, 500);
        
        return {
          walletsGenerated: data.count || 0,
          errors: []
        };
      } else {
        // No wallets generated - likely RLS policy issue based on logs
        console.warn('Nenhuma carteira foi gerada - possível problema de RLS policy:', data);
        const warningMsg = 'Erro de permissão na criação de carteiras. Verifique as políticas de segurança.';
        toast.error(warningMsg);
        setGenerationStatus('error');
        setGenerationErrors([warningMsg]);
        return { walletsGenerated: 0, errors: [warningMsg] };
      }
    } catch (error) {
      console.error('Erro na geração de carteiras:', error);
      const errorMessage = error?.message || 'Erro desconhecido na geração';
      toast.error(`Falha na geração: ${errorMessage}`);
      setGenerationStatus('error');
      setGenerationErrors([errorMessage]);
      return { walletsGenerated: 0, errors: [errorMessage] };
    }
  }, [user, wallets, navigate, loadWallets]);

  const refreshAllBalances = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available for refresh');
      return;
    }
    
    setIsLoading(true);
    logSecurityCompliance('WALLET_BALANCE_REFRESH');
    try {
      toast.info('Atualizando saldos...');
      
      // Call loadWallets to refresh data from database
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao atualizar saldos:', error);
        throw error;
      }

      const mappedWallets = (data || []).map(wallet => ({
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
      toast.success('Saldos atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar saldos:', error);
      toast.error('Erro ao atualizar saldos');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Computed values
  const hasGeneratedWallets = wallets.some(w => w.address !== 'pending_generation');
  const hasPendingWallets = wallets.some(w => w.address === 'pending_generation');

  // Auto-load wallets when user changes
  useEffect(() => {
    if (user?.id) {
      console.log('User changed, loading wallets...');
      loadWallets();
    } else {
      console.log('No user, clearing wallets');
      setWallets([]);
      setGenerationStatus('idle');
    }
  }, [user?.id]); // Remove loadWallets from dependencies to avoid infinite loop

  return {
    wallets,
    isLoading,
    generationStatus,
    generationErrors,
    hasGeneratedWallets,
    hasPendingWallets,
    generateWallets,
    refreshAllBalances,
    loadWallets
  };
};
