
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

  // Função para criar código baseado no nome do usuário
  const createUserBasedCode = async (userName: string): Promise<string> => {
    // Limpar e abreviar o nome
    const cleanName = userName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-zA-Z0-9]/g, '') // Remove caracteres especiais
      .toUpperCase()
      .substring(0, 6); // Máximo 6 caracteres

    // Se o nome limpo for muito curto, usar o user ID
    const namePrefix = cleanName.length >= 3 ? cleanName : user?.id?.substring(0, 6).toUpperCase() || 'USER';
    
    // Adicionar sufixo único baseado no user ID
    const userSuffix = user?.id?.substring(0, 4).toUpperCase() || '0000';
    
    return `SATO${namePrefix}${userSuffix}`;
  };

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
      console.log('Starting referral code generation for user:', user.id);
      
      // Buscar dados do perfil do usuário para obter o nome
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, referral_code')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }
      
      // Se já tem código, retornar o existente
      if (profile?.referral_code) {
        setReferralCode(profile.referral_code);
        toast({
          title: "Código já existe!",
          description: "Você já possui um código de indicação.",
        });
        return;
      }
      
      // Obter nome do usuário (do perfil ou dos metadados)
      let userName = profile?.full_name || 
                   user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0] || 
                   'Usuario';
      
      console.log('Using name for code generation:', userName);
      
      // Gerar código baseado no nome
      const baseCode = await createUserBasedCode(userName);
      console.log('Generated base code:', baseCode);
      
      // Verificar se o código já existe
      const { data: existingCode, error: checkError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('referral_code', baseCode)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing code:', checkError);
        throw checkError;
      }
      
      let finalCode = baseCode;
      
      // Se código já existe, adicionar sufixo numérico
      if (existingCode) {
        let counter = 1;
        let isUnique = false;
        
        while (!isUnique && counter < 100) {
          const testCode = `${baseCode}${counter.toString().padStart(2, '0')}`;
          
          const { data: testExisting, error: testError } = await supabase
            .from('profiles')
            .select('referral_code')
            .eq('referral_code', testCode)
            .maybeSingle();
          
          if (testError && testError.code !== 'PGRST116') {
            throw testError;
          }
          
          if (!testExisting) {
            finalCode = testCode;
            isUnique = true;
          } else {
            counter++;
          }
        }
        
        if (!isUnique) {
          throw new Error('Não foi possível gerar um código único');
        }
      }
      
      console.log('Final code to save:', finalCode);
      
      // Salvar o código no perfil (criar ou atualizar)
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          referral_code: finalCode,
          full_name: userName // Garantir que o nome está salvo
        }, {
          onConflict: 'id'
        });
      
      if (upsertError) {
        console.error('Error saving referral code:', upsertError);
        throw upsertError;
      }
      
      setReferralCode(finalCode);
      
      toast({
        title: "Código gerado!",
        description: `Seu código de indicação ${finalCode} foi criado com sucesso.`,
      });
      
      console.log('Referral code generated successfully:', finalCode);
      
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
        .select('referral_code, total_referrals, full_name')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }
      
      if (!profile) {
        // Criar perfil se não existir
        console.log('Profile not found, creating new profile');
        const userName = user.user_metadata?.full_name || 
                        user.user_metadata?.name || 
                        user.email?.split('@')[0] || 
                        'Usuario';
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: userName,
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
      } else {
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
          // Type the data properly to match our interface
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
