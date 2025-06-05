
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/contexts/auth/types';

export interface ReferralProfile {
  id: string;
  full_name: string | null;
  referral_code: string | null;
  total_referrals: number;
  referral_count: number;
  premium_status: string;
  premium_expiry: string | null;
  referred_by: string | null;
}

export class ReferralService {
  /**
   * Busca ou cria o perfil do usuário com código de referência automático
   */
  static async getOrCreateProfile(user: AuthUser): Promise<ReferralProfile> {
    console.log('Getting or creating profile for user:', user.id);
    
    // Tentar buscar perfil existente
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, full_name, referral_code, total_referrals, referral_count, premium_status, premium_expiry, referred_by')
      .eq('id', user.id)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      throw new Error(`Erro ao buscar perfil: ${fetchError.message}`);
    }
    
    if (existingProfile) {
      console.log('Found existing profile:', existingProfile);
      return existingProfile;
    }
    
    // Criar novo perfil - o trigger vai gerar o código automaticamente
    console.log('Creating new profile');
    const userName = this.extractUserName(user);
    
    const newProfile = {
      id: user.id,
      full_name: userName,
      referral_count: 0,
      premium_status: 'inactive'
    };
    
    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select('id, full_name, referral_code, total_referrals, referral_count, premium_status, premium_expiry, referred_by')
      .single();
    
    if (createError) {
      console.error('Error creating profile:', createError);
      throw new Error(`Erro ao criar perfil: ${createError.message}`);
    }
    
    console.log('Created new profile:', createdProfile);
    return createdProfile;
  }

  /**
   * Força a geração de um novo código de referência
   */
  static async generateReferralCode(user: AuthUser): Promise<string> {
    console.log('Generating referral code for user:', user.id);
    
    const userName = this.extractUserName(user);
    
    // Chamar a função do banco para gerar código único
    const { data, error } = await supabase.rpc('generate_unique_referral_code', {
      user_name: userName,
      user_id: user.id
    });
    
    if (error) {
      console.error('Error generating referral code:', error);
      throw new Error(`Erro ao gerar código: ${error.message}`);
    }
    
    const newCode = data;
    console.log('Generated code:', newCode);
    
    // Salvar o código no perfil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        referral_code: newCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (updateError) {
      console.error('Error saving referral code:', updateError);
      throw new Error(`Erro ao salvar código: ${updateError.message}`);
    }
    
    return newCode;
  }

  /**
   * Processa uma referência quando um usuário se cadastra
   */
  static async processReferral(referralCode: string, newUserId: string): Promise<void> {
    console.log('Processing referral:', { referralCode, newUserId });
    
    // Chamar a função do banco para processar a referência
    const { error } = await supabase.rpc('process_referral', {
      referrer_code: referralCode,
      referred_user_id: newUserId
    });
    
    if (error) {
      console.error('Error processing referral:', error);
      throw new Error(`Erro ao processar indicação: ${error.message}`);
    }
    
    console.log('Referral processed successfully');
  }

  /**
   * Busca estatísticas de referência do usuário
   */
  static async getReferralStats(userId: string) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_count, premium_status, premium_expiry')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching referral stats:', profileError);
      throw new Error(`Erro ao buscar estatísticas: ${profileError.message}`);
    }
    
    return {
      totalReferrals: profile.referral_count || 0,
      isPremium: profile.premium_status === 'active',
      premiumExpiry: profile.premium_expiry
    };
  }

  /**
   * Busca histórico de indicações
   */
  static async getReferralHistory(userId: string) {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching referral history:', error);
      return [];
    }
    
    return referrals || [];
  }

  /**
   * Extrai o nome do usuário dos metadados ou email
   */
  private static extractUserName(user: AuthUser): string {
    const fromMetadata = user.user_metadata?.full_name || 
                        user.user_metadata?.name || 
                        user.user_metadata?.first_name;
    
    const fromEmail = user.email?.split('@')[0];
    
    return fromMetadata || fromEmail || 'usuario';
  }
}
