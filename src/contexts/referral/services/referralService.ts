
import { supabase } from '@/integrations/supabase/client';
import { ReferralCodeGenerator } from '../utils/codeGenerator';
import { AuthUser } from '@/contexts/auth/types';

export interface ReferralProfile {
  id: string;
  full_name: string | null;
  referral_code: string | null;
  total_referrals: number;
}

export class ReferralService {
  /**
   * Busca ou cria o perfil do usuário
   */
  static async getOrCreateProfile(user: AuthUser): Promise<ReferralProfile> {
    console.log('Getting or creating profile for user:', user.id);
    
    // Tentar buscar perfil existente
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, full_name, referral_code, total_referrals')
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
    
    // Criar novo perfil
    console.log('Creating new profile');
    const userName = this.extractUserName(user);
    
    const newProfile = {
      id: user.id,
      full_name: userName,
      referral_code: null,
      total_referrals: 0
    };
    
    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select('id, full_name, referral_code, total_referrals')
      .single();
    
    if (createError) {
      console.error('Error creating profile:', createError);
      throw new Error(`Erro ao criar perfil: ${createError.message}`);
    }
    
    console.log('Created new profile:', createdProfile);
    return createdProfile;
  }

  /**
   * Gera um código de referência único
   */
  static async generateUniqueReferralCode(user: AuthUser): Promise<string> {
    console.log('Generating unique referral code for user:', user.id);
    
    const userName = this.extractUserName(user);
    console.log('Using userName:', userName);
    
    // Gerar código base
    const baseCode = ReferralCodeGenerator.generateCode({
      userName,
      userId: user.id
    });
    
    console.log('Base code generated:', baseCode);
    
    // Verificar se o código já existe
    const isUnique = await this.checkCodeUniqueness(baseCode);
    
    if (isUnique) {
      console.log('Base code is unique, using:', baseCode);
      return baseCode;
    }
    
    // Gerar variações até encontrar um código único
    console.log('Base code exists, generating variations');
    const variations = ReferralCodeGenerator.generateVariations(baseCode);
    
    for (const variation of variations) {
      const isVariationUnique = await this.checkCodeUniqueness(variation);
      if (isVariationUnique) {
        console.log('Found unique variation:', variation);
        return variation;
      }
    }
    
    throw new Error('Não foi possível gerar um código único após múltiplas tentativas');
  }

  /**
   * Salva o código de referência no perfil do usuário
   */
  static async saveReferralCode(userId: string, referralCode: string): Promise<void> {
    console.log('Saving referral code:', { userId, referralCode });
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        referral_code: referralCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error saving referral code:', error);
      throw new Error(`Erro ao salvar código: ${error.message}`);
    }
    
    console.log('Referral code saved successfully');
  }

  /**
   * Verifica se um código é único
   */
  private static async checkCodeUniqueness(code: string): Promise<boolean> {
    console.log('Checking uniqueness for code:', code);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('referral_code', code)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking code uniqueness:', error);
      throw new Error(`Erro ao verificar unicidade: ${error.message}`);
    }
    
    const isUnique = !data;
    console.log('Code uniqueness check result:', { code, isUnique });
    return isUnique;
  }

  /**
   * Extrai o nome do usuário dos metadados ou email
   */
  private static extractUserName(user: AuthUser): string {
    const fromMetadata = user.user_metadata?.full_name || 
                        user.user_metadata?.name || 
                        user.user_metadata?.first_name;
    
    const fromEmail = user.email?.split('@')[0];
    
    return fromMetadata || fromEmail || 'Usuario';
  }
}
