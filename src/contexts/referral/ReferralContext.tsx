
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReferralService } from './services/referralService';

export interface ReferralData {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  referred_user_email: string;
  created_at: string;
  status: 'completed' | 'pending';
}

export interface ReferralContextType {
  referralCode: string;
  totalReferrals: number;
  referralsNeeded: number;
  referralHistory: ReferralData[];
  isLoading: boolean;
  generateReferralCode: () => Promise<void>;
  shareReferralLink: () => Promise<void>;
  copyReferralCode: () => Promise<void>;
  refreshReferralData: () => Promise<void>;
}

const ReferralContext = createContext<ReferralContextType | null>(null);

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};

export const ReferralProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralHistory, setReferralHistory] = useState<ReferralData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const referralsNeeded = 20 - (totalReferrals % 20);

  const generateReferralCode = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para gerar um código de indicação.");
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Starting referral code generation for user:', user.id);
      
      // Buscar ou criar perfil
      const profile = await ReferralService.getOrCreateProfile(user);
      
      // Se já tem código, retornar o existente
      if (profile.referral_code) {
        setReferralCode(profile.referral_code);
        toast.success(`Código de indicação: ${profile.referral_code}`);
        return;
      }
      
      // Gerar novo código único
      const newCode = await ReferralService.generateUniqueReferralCode(user);
      console.log('Generated unique code:', newCode);
      
      // Salvar o código
      await ReferralService.saveReferralCode(user.id, newCode);
      
      setReferralCode(newCode);
      toast.success(`Código gerado com sucesso: ${newCode}`);
      
      console.log('Referral code generation completed successfully');
      
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Não foi possível gerar o código: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (!referralCode) {
      toast.error("Nenhum código de indicação disponível para copiar.");
      return;
    }

    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Código copiado para a área de transferência!");
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error("Não foi possível copiar o código. Tente copiar manualmente.");
    }
  };

  const shareReferralLink = async () => {
    if (!referralCode) {
      toast.error("Gere um código de indicação primeiro.");
      return;
    }

    const shareUrl = `${window.location.origin}/auth?ref=${referralCode}`;
    const shareText = `🚀 Monitore suas carteiras Bitcoin com o SatoTrack! Use meu código ${referralCode} e ganhe benefícios: ${shareUrl}`;
    
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: 'SatoTrack - Bitcoin Tracker',
          text: shareText,
          url: shareUrl
        });
        toast.success("Link compartilhado com sucesso!");
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
        // Fallback para clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success("Link copiado para compartilhar!");
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Link copiado para compartilhar!");
    }
  };

  const refreshReferralData = async () => {
    if (!user) {
      console.log('No user available for refreshReferralData');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Refreshing referral data for user:', user.id);
      
      // Buscar dados do perfil
      const profile = await ReferralService.getOrCreateProfile(user);
      
      setReferralCode(profile.referral_code || '');
      setTotalReferrals(profile.total_referrals || 0);
      
      // Buscar histórico de indicações
      try {
        const { data: referrals, error: referralsError } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (referralsError) {
          console.error('Erro ao buscar indicações:', referralsError);
          setReferralHistory([]);
        } else {
          console.log('Referrals found:', referrals?.length || 0);
          const typedReferrals: ReferralData[] = (referrals || []).map(referral => ({
            ...referral,
            status: referral.status as 'completed' | 'pending'
          }));
          setReferralHistory(typedReferrals);
        }
      } catch (error) {
        console.error('Erro na consulta de referrals:', error);
        setReferralHistory([]);
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados de indicação:', error);
      toast.error("Não foi possível carregar os dados de indicação.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User changed, refreshing referral data');
      refreshReferralData();
    } else {
      console.log('No user, resetting referral state');
      setReferralCode('');
      setTotalReferrals(0);
      setReferralHistory([]);
    }
  }, [user]);

  const contextValue: ReferralContextType = {
    referralCode,
    totalReferrals,
    referralsNeeded,
    referralHistory,
    isLoading,
    generateReferralCode,
    shareReferralLink,
    copyReferralCode,
    refreshReferralData
  };

  return (
    <ReferralContext.Provider value={contextValue}>
      {children}
    </ReferralContext.Provider>
  );
};
