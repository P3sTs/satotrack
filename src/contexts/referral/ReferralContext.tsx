import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const createUserBasedCode = (userName: string, userId: string): string => {
    // Limpar e abreviar o nome
    const cleanName = userName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-zA-Z0-9]/g, '') // Remove caracteres especiais
      .toUpperCase()
      .substring(0, 4); // Máximo 4 caracteres

    // Se o nome limpo for muito curto, usar o user ID
    const namePrefix = cleanName.length >= 3 ? cleanName : userId.substring(0, 4).toUpperCase();
    
    // Adicionar sufixo único baseado no user ID
    const userSuffix = userId.substring(0, 4).toUpperCase();
    
    return `SATO${namePrefix}${userSuffix}`;
  };

  const generateReferralCode = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para gerar um código de indicação.");
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
        .single();
      
      let currentProfile = profile;
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }
      
      // Se não existe perfil, criar um novo
      if (profileError && profileError.code === 'PGRST116') {
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
          console.error('Error creating profile:', insertError);
          throw insertError;
        }
        
        // Buscar novamente o perfil criado
        const { data: newProfile, error: newProfileError } = await supabase
          .from('profiles')
          .select('full_name, referral_code')
          .eq('id', user.id)
          .single();
        
        if (newProfileError) {
          throw newProfileError;
        }
        
        currentProfile = newProfile;
      }
      
      // Se já tem código, retornar o existente
      if (currentProfile?.referral_code) {
        setReferralCode(currentProfile.referral_code);
        toast.success("Código de indicação já existe!");
        return;
      }
      
      // Obter nome do usuário (do perfil ou dos metadados)
      let userName = currentProfile?.full_name || 
                   user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0] || 
                   'Usuario';
      
      console.log('Using name for code generation:', userName);
      
      // Gerar código baseado no nome
      const baseCode = createUserBasedCode(userName, user.id);
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
      
      // Salvar o código no perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          referral_code: finalCode,
          full_name: userName // Garantir que o nome está salvo
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error saving referral code:', updateError);
        throw updateError;
      }
      
      setReferralCode(finalCode);
      
      toast.success(`Código gerado com sucesso: ${finalCode}`);
      
      console.log('Referral code generated successfully:', finalCode);
      
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      toast.error("Não foi possível gerar o código de indicação. Tente novamente.");
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
