
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
  isPremium: boolean;
  premiumExpiry: string | null;
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
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiry, setPremiumExpiry] = useState<string | null>(null);
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
      
      const newCode = await ReferralService.generateReferralCode(user);
      
      setReferralCode(newCode);
      toast.success(`Novo código gerado: ${newCode}`);
      
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
      
      // Buscar dados do perfil com retry em caso de erro
      let profile;
      let retries = 3;
      
      while (retries > 0) {
        try {
          profile = await ReferralService.getOrCreateProfile(user);
          break;
        } catch (error) {
          console.error(`Attempt ${4 - retries} failed:`, error);
          retries--;
          if (retries === 0) throw error;
          // Aguardar um pouco antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (profile) {
        setReferralCode(profile.referral_code || '');
        setTotalReferrals(profile.referral_count || 0);
        setIsPremium(profile.premium_status === 'active');
        setPremiumExpiry(profile.premium_expiry);
        
        // Buscar histórico de indicações de forma opcional
        try {
          const history = await ReferralService.getReferralHistory(user.id);
          const typedReferrals: ReferralData[] = history.map(referral => ({
            ...referral,
            status: referral.status as 'completed' | 'pending'
          }));
          setReferralHistory(typedReferrals);
        } catch (error) {
          console.error('Erro na consulta de referrals (não crítico):', error);
          setReferralHistory([]);
        }
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados de indicação:', error);
      // Não mostrar toast de erro em caso de falha, apenas logar
      console.log("Falha ao carregar dados de indicação, continuando...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      console.log('User changed, refreshing referral data');
      // Aguardar um pouco para garantir que o usuário foi criado completamente
      const timer = setTimeout(() => {
        refreshReferralData();
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      console.log('No user, resetting referral state');
      setReferralCode('');
      setTotalReferrals(0);
      setReferralHistory([]);
      setIsPremium(false);
      setPremiumExpiry(null);
    }
  }, [user?.id]);

  const contextValue: ReferralContextType = {
    referralCode,
    totalReferrals,
    referralsNeeded,
    referralHistory,
    isPremium,
    premiumExpiry,
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
