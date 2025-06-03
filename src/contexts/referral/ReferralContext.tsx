
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      toast({
        title: "Erro",
        description: "Você precisa estar logado para gerar um código de indicação.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Gerar código único baseado no user ID e timestamp
      const timestamp = Date.now().toString(36);
      const userPrefix = user.id.slice(0, 6).toUpperCase();
      const code = `SATO${userPrefix}${timestamp.toUpperCase()}`;
      
      console.log('Generating referral code:', code, 'for user:', user.id);
      
      // Verificar se o código já existe
      const { data: existingCode, error: checkError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('referral_code', code)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing code:', checkError);
        throw checkError;
      }
      
      if (existingCode) {
        // Se código já existe, gerar um novo com sufixo aleatório
        const randomSuffix = Math.random().toString(36).substr(2, 3).toUpperCase();
        const newCode = `${code}${randomSuffix}`;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            referral_code: newCode
          });
        
        if (updateError) throw updateError;
        setReferralCode(newCode);
      } else {
        // Salvar o código no perfil do usuário
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            referral_code: code
          });
        
        if (updateError) throw updateError;
        setReferralCode(code);
      }
      
      toast({
        title: "Código gerado!",
        description: "Seu código de indicação foi criado com sucesso.",
      });
      
      console.log('Referral code generated successfully:', code);
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o código de indicação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (!referralCode) {
      toast({
        title: "Erro",
        description: "Nenhum código de indicação disponível para copiar.",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(referralCode);
      toast({
        title: "Código copiado!",
        description: "Seu código de indicação foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código. Tente copiar manualmente.",
        variant: "destructive"
      });
    }
  };

  const shareReferralLink = async () => {
    if (!referralCode) {
      toast({
        title: "Erro",
        description: "Gere um código de indicação primeiro.",
        variant: "destructive"
      });
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
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
        // Fallback para clipboard
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Link copiado!",
          description: "Como o compartilhamento não funcionou, o link foi copiado para a área de transferência.",
        });
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
    if (!user) {
      console.log('No user available for refreshReferralData');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Refreshing referral data for user:', user.id);
      
      // Buscar dados do perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code, total_referrals')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        
        // Se o perfil não existir, criar um novo
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, creating new profile');
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              referral_code: null,
              total_referrals: 0
            });
          
          if (insertError) {
            console.error('Erro ao criar perfil:', insertError);
          } else {
            console.log('Profile created successfully');
            setReferralCode('');
            setTotalReferrals(0);
          }
        }
      } else if (profile) {
        console.log('Profile found:', profile);
        setReferralCode(profile.referral_code || '');
        setTotalReferrals(profile.total_referrals || 0);
      }
      
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
          setReferralHistory(referrals || []);
        }
      } catch (error) {
        console.error('Erro na consulta de referrals:', error);
        setReferralHistory([]);
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados de indicação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de indicação.",
        variant: "destructive"
      });
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
