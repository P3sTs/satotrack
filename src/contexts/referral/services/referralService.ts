import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/contexts/auth/types';
import { ReferralCodeGenerator } from '../utils/codeGenerator';

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
   * Busca ou cria o perfil do usuário com tratamento robusto de erros
   */
  static async getOrCreateProfile(user: AuthUser): Promise<ReferralProfile> {
    console.log('Getting or creating profile for user:', user.id);
    
    try {
      // Tentar buscar perfil existente primeiro
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, full_name, referral_code, total_referrals, referral_count, premium_status, premium_expiry, referred_by')
        .eq('id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        throw new Error(`Erro ao buscar perfil: ${fetchError.message}`);
      }
      
      if (existingProfile) {
        console.log('Found existing profile:', existingProfile);
        
        // Se não tem código de referência, gerar um
        if (!existingProfile.referral_code) {
          console.log('Profile exists but no referral code, generating one...');
          try {
            const newCode = await this.generateReferralCode(user);
            return {
              ...existingProfile,
              referral_code: newCode
            };
          } catch (error) {
            console.error('Failed to generate referral code:', error);
            // Retornar perfil mesmo sem código
            return existingProfile;
          }
        }
        
        return existingProfile;
      }
      
      // Perfil não existe, criar novo
      console.log('Creating new profile');
      const userName = this.extractUserName(user);
      
      // Gerar código antes de criar o perfil
      let referralCode;
      try {
        referralCode = ReferralCodeGenerator.generateCode({
          userName,
          userId: user.id
        });
        
        // Verificar se é único
        const { data: existingCode } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode)
          .maybeSingle();
        
        if (existingCode) {
          // Se já existe, adicionar timestamp
          referralCode = `${referralCode}${Date.now().toString().slice(-4)}`;
        }
      } catch (error) {
        console.error('Error generating code, will use fallback:', error);
        referralCode = `USER${user.id.slice(0, 8).toUpperCase()}`;
      }
      
      const newProfile = {
        id: user.id,
        full_name: userName,
        referral_code: referralCode,
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
        
        // Se o erro for de RLS, pode ser que o perfil já existe mas não conseguimos acessar
        if (createError.code === '42501' || createError.message.includes('policy')) {
          console.log('RLS error, trying to fetch profile again...');
          // Tentar buscar novamente após um pequeno delay
          await new Promise(resolve => setTimeout(resolve, 500));
          return this.getOrCreateProfile(user);
        }
        
        throw new Error(`Erro ao criar perfil: ${createError.message}`);
      }
      
      console.log('Created new profile:', createdProfile);
      return createdProfile;
      
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      
      // Em caso de erro crítico, retornar um perfil básico para não travar o app
      if (error instanceof Error && error.message.includes('policy')) {
        console.log('Returning fallback profile due to policy error');
        return {
          id: user.id,
          full_name: this.extractUserName(user),
          referral_code: null,
          total_referrals: 0,
          referral_count: 0,
          premium_status: 'inactive',
          premium_expiry: null,
          referred_by: null
        };
      }
      
      throw error;
    }
  }

  /**
   * Gera um código de referência único com tratamento robusto
   */
  static async generateReferralCode(user: AuthUser): Promise<string> {
    console.log('Generating referral code for user:', user.id);
    
    const userName = this.extractUserName(user);
    console.log('Using username:', userName);
    
    try {
      // Gerar código base
      const baseCode = ReferralCodeGenerator.generateCode({
        userName,
        userId: user.id
      });
      
      console.log('Generated base code:', baseCode);
      
      // Verificar se o código já existe e gerar variações se necessário
      let finalCode = baseCode;
      let counter = 1;
      
      while (counter <= 5) { // Reduzir tentativas para evitar loops
        console.log('Checking if code exists:', finalCode);
        
        const { data: existingCode, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', finalCode)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking code existence:', error);
          // Em caso de erro, usar timestamp para garantir unicidade
          finalCode = `${baseCode}${Date.now().toString().slice(-3)}`;
          break;
        }
        
        if (!existingCode) {
          console.log('Code is unique:', finalCode);
          break;
        }
        
        // Código já existe, gerar uma variação
        finalCode = `${baseCode}${counter.toString().padStart(2, '0')}`;
        counter++;
      }
      
      if (counter > 5) {
        // Usar timestamp como fallback
        finalCode = `${baseCode}${Date.now().toString().slice(-3)}`;
      }
      
      // Salvar o código no perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          referral_code: finalCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error saving referral code:', updateError);
        // Não falhar por isso, apenas logar
        console.log('Failed to save code but continuing with generated code');
      }
      
      console.log('Successfully generated code:', finalCode);
      return finalCode;
      
    } catch (error) {
      console.error('Error in generateReferralCode:', error);
      // Fallback: usar um código baseado no ID do usuário
      const fallbackCode = `USER${user.id.slice(0, 8).toUpperCase()}`;
      console.log('Using fallback code:', fallbackCode);
      return fallbackCode;
    }
  }

  /**
   * Processa uma referência quando um usuário se cadastra
   */
  static async processReferral(referralCode: string, newUserId: string): Promise<void> {
    console.log('Processing referral:', { referralCode, newUserId });
    
    try {
      // Buscar o usuário que fez a referência
      const { data: referrer, error: referrerError } = await supabase
        .from('profiles')
        .select('id, referral_count, premium_status, premium_expiry')
        .eq('referral_code', referralCode)
        .maybeSingle();
      
      if (referrerError) {
        console.error('Error finding referrer:', referrerError);
        throw new Error(`Erro ao buscar referenciador: ${referrerError.message}`);
      }
      
      if (!referrer) {
        console.log('Referrer not found for code:', referralCode);
        throw new Error('Código de referência inválido');
      }
      
      console.log('Found referrer:', referrer);
      
      // Atualizar o perfil do novo usuário com a referência
      const { error: updateReferredError } = await supabase
        .from('profiles')
        .update({ referred_by: referralCode })
        .eq('id', newUserId);
      
      if (updateReferredError) {
        console.error('Error updating referred user:', updateReferredError);
        // Não falhar por isso
      }
      
      // Incrementar contador do referenciador
      const newCount = (referrer.referral_count || 0) + 1;
      const updateData: any = {
        referral_count: newCount,
        updated_at: new Date().toISOString()
      };
      
      // Verificar se atingiu 20 referências para dar Premium
      if (newCount >= 20 && (newCount % 20 === 0)) {
        const now = new Date();
        const premiumExpiry = referrer.premium_expiry 
          ? new Date(referrer.premium_expiry) 
          : now;
        
        // Se já expirou ou não tinha, começar de agora
        const newExpiry = premiumExpiry < now 
          ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 dias a partir de agora
          : new Date(premiumExpiry.getTime() + 30 * 24 * 60 * 60 * 1000); // Adicionar 30 dias
        
        updateData.premium_status = 'active';
        updateData.premium_expiry = newExpiry.toISOString();
        
        console.log('User reached 20 referrals, granting Premium until:', newExpiry);
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', referrer.id);
      
      if (updateError) {
        console.error('Error updating referrer:', updateError);
        throw new Error(`Erro ao atualizar referenciador: ${updateError.message}`);
      }
      
      // Registrar a referência na tabela de referrals
      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_user_id: referrer.id,
          referred_user_id: newUserId,
          referred_user_email: '', // Será preenchido pelo trigger se necessário
          status: 'completed'
        });
      
      if (insertError) {
        console.error('Error inserting referral record:', insertError);
        // Não falhar por isso
      }
      
      console.log('Referral processed successfully');
      
    } catch (error) {
      console.error('Error processing referral:', error);
      throw error;
    }
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
    
    return fromMetadata || fromEmail || 'Usuario';
  }
}
