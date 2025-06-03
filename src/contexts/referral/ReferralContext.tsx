
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ReferralData {
  id: string;
  user_id: string;
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
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Gerar código único baseado no user ID
      const code = `SATO${user.id.slice(0, 8).toUpperCase()}`;
      
      // Salvar no perfil do usuário
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          referral_code: code
        });
      
      if (error) throw error;
      
      setReferralCode(code);
      
      toast({
        title: "Código gerado!",
        description: "Seu código de indicação foi criado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o código de indicação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast({
        title: "Código copiado!",
        description: "Seu código de indicação foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código.",
        variant: "destructive"
      });
    }
  };

  const shareReferralLink = async () => {
    const shareUrl = `${window.location.origin}/auth?ref=${referralCode}`;
    const shareText = `🚀 Monitore suas carteiras Bitcoin com o SatoTrack! Use meu código ${referralCode} e ganhe benefícios: ${shareUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SatoTrack - Bitcoin Tracker',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Link copiado!",
        description: "Link de indicação copiado para compartilhar.",
      });
    }
  };

  const refreshReferralData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Buscar dados do perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code, total_referrals')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profile) {
        setReferralCode(profile.referral_code || '');
        setTotalReferrals(profile.total_referrals || 0);
      }
      
      // Buscar histórico de indicações
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (referralsError) throw referralsError;
      
      setReferralHistory(referrals || []);
      
    } catch (error) {
      console.error('Erro ao buscar dados de indicação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshReferralData();
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
