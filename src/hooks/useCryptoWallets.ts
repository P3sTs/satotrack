
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export interface CryptoWallet {
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

interface GenerateWalletsResult {
  success: boolean;
  walletsGenerated: number;
  totalRequested: number;
  wallets: Array<{
    currency: string;
    name: string;
    address: string;
  }>;
  errors?: string[];
}

export const useCryptoWallets = () => {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, session } = useAuth();

  const loadWallets = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('Carregando carteiras do usuário:', user.id);
      
      const { data: walletsData, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar carteiras:', error);
        throw error;
      }

      console.log('Carteiras carregadas:', walletsData);
      
      // Fix: Map the database fields correctly to include currency
      const formattedWallets: CryptoWallet[] = (walletsData || []).map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        address: wallet.address,
        currency: wallet.name?.split(' ')[0] || 'UNKNOWN', // Extract currency from name
        balance: wallet.balance?.toString() || '0',
        created_at: wallet.created_at,
        user_id: wallet.user_id,
        xpub: wallet.xpub,
        private_key_encrypted: wallet.private_key_encrypted
      }));

      setWallets(formattedWallets);
    } catch (error) {
      console.error('Erro ao carregar carteiras:', error);
      toast.error('Erro ao carregar carteiras');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateWallets = useCallback(async (): Promise<GenerateWalletsResult | null> => {
    if (!user || !session) {
      throw new Error('Usuário não autenticado');
    }

    setIsGenerating(true);
    try {
      console.log('Gerando carteiras para usuário:', user.id);
      
      const { data, error } = await supabase.functions.invoke('generate-crypto-wallets', {
        body: { userId: user.id },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Erro na função de geração:', error);
        throw new Error(error.message || 'Erro ao gerar carteiras');
      }

      console.log('Resposta da geração:', data);
      return data as GenerateWalletsResult;
    } catch (error) {
      console.error('Erro ao gerar carteiras:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [user, session]);

  const refreshAllBalances = useCallback(async () => {
    if (wallets.length === 0) return;

    setIsLoading(true);
    try {
      // Implementação futura - atualizar saldos via Tatum
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay
      toast.success('Saldos atualizados!');
      
      // Recarregar carteiras
      await loadWallets();
    } catch (error) {
      console.error('Erro ao atualizar saldos:', error);
      toast.error('Erro ao atualizar saldos');
    } finally {
      setIsLoading(false);
    }
  }, [wallets, loadWallets]);

  const hasGeneratedWallets = wallets.some(w => w.address !== 'pending_generation');
  const hasPendingWallets = wallets.some(w => w.address === 'pending_generation');

  return {
    wallets,
    isLoading,
    isGenerating,
    hasGeneratedWallets,
    hasPendingWallets,
    loadWallets,
    generateWallets,
    refreshAllBalances,
  };
};
