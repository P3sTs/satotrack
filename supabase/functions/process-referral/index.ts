
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para gerar código de referência melhorada
function generateReferralCode(userName: string, userId: string): string {
  console.log('Generating code for:', { userName, userId });
  
  // Limpar nome e criar base mais robusta
  const cleanName = userName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .trim() || 'USER';
  
  // Parte do nome (3 caracteres)
  const namePart = cleanName.length <= 3 
    ? cleanName.padEnd(3, 'X') 
    : cleanName.substring(0, 3);
  
  // Sufixo do ID mais único
  const cleanId = userId.replace(/-/g, '').toUpperCase();
  const userSuffix = cleanId.substring(0, 2) + cleanId.substring(cleanId.length - 2);
  
  // Adicionar timestamp para garantir unicidade
  const timestamp = Date.now().toString().slice(-3);
  
  const code = `SATO${namePart}${userSuffix}${timestamp}`;
  console.log('Generated code:', code);
  
  return code;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, password, full_name, referral_code } = await req.json();

    console.log('Processing referral registration for:', email, 'with code:', referral_code);

    // Validar dados de entrada
    if (!email || !password || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Email, senha e nome completo são obrigatórios' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 1. Criar o novo usuário
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: full_name || '',
      },
      email_confirm: true
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar usuário: ' + authError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const newUserId = authData.user.id;
    console.log('User created successfully:', newUserId);

    // 2. Gerar código de referência para o novo usuário
    const newUserReferralCode = generateReferralCode(full_name, newUserId);
    console.log('Generated referral code for new user:', newUserReferralCode);

    // 3. Criar perfil do usuário
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUserId,
        full_name: full_name || '',
        referral_code: newUserReferralCode,
        referred_by: referral_code || null,
        referral_count: 0,
        premium_status: 'inactive'
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      
      // Se der erro de violação de RLS, tentar novamente depois de um delay
      if (profileError.code === '42501') {
        console.log('RLS policy violation, retrying after delay...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { error: retryError } = await supabase
          .from('profiles')
          .insert({
            id: newUserId,
            full_name: full_name || '',
            referral_code: newUserReferralCode,
            referred_by: referral_code || null,
            referral_count: 0,
            premium_status: 'inactive'
          });
        
        if (retryError) {
          console.error('Retry also failed:', retryError);
          // Não falhar por isso, continuar sem perfil
        }
      }
    }

    // 4. Se tiver código de referência, processar a indicação
    let referralProcessed = false;
    if (referral_code && referral_code.trim()) {
      try {
        // Buscar o referenciador
        const { data: referrer, error: referrerError } = await supabase
          .from('profiles')
          .select('id, referral_count, premium_status, premium_expiry')
          .eq('referral_code', referral_code.trim())
          .maybeSingle();
        
        if (referrerError) {
          console.error('Error finding referrer:', referrerError);
        } else if (referrer) {
          console.log('Found referrer:', referrer);
          
          // Incrementar contador
          const newCount = (referrer.referral_count || 0) + 1;
          const updateData: any = {
            referral_count: newCount,
            updated_at: new Date().toISOString()
          };
          
          // Verificar se atingiu 20 referências
          if (newCount >= 20 && (newCount % 20 === 0)) {
            const now = new Date();
            const premiumExpiry = referrer.premium_expiry 
              ? new Date(referrer.premium_expiry) 
              : now;
            
            const newExpiry = premiumExpiry < now 
              ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
              : new Date(premiumExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
            
            updateData.premium_status = 'active';
            updateData.premium_expiry = newExpiry.toISOString();
            
            console.log('User reached 20 referrals, granting Premium until:', newExpiry);
          }
          
          // Atualizar referenciador
          const { error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', referrer.id);
          
          if (!updateError) {
            // Registrar referência
            const { error: insertError } = await supabase
              .from('referrals')
              .insert({
                referrer_user_id: referrer.id,
                referred_user_id: newUserId,
                referred_user_email: email,
                status: 'completed'
              });
            
            if (!insertError) {
              referralProcessed = true;
              console.log('Referral processed successfully');
            } else {
              console.error('Error inserting referral record:', insertError);
            }
          } else {
            console.error('Error updating referrer:', updateError);
          }
        } else {
          console.log('Referrer not found for code:', referral_code);
        }
      } catch (error) {
        console.error('Error processing referral:', error);
      }
    }

    // 5. Criar configurações padrão do usuário (opcional, não bloquear se falhar)
    try {
      await supabase
        .from('user_settings')
        .insert({
          user_id: newUserId,
          telegram_notifications_enabled: false,
          email_daily_summary: false,
          email_weekly_summary: false,
          push_notifications_enabled: false,
          price_alert_threshold: 5,
          balance_alert_threshold: 0
        });
    } catch (error) {
      console.error('Error creating user settings (non-critical):', error);
    }

    // 6. Criar plano padrão do usuário (opcional, não bloquear se falhar)
    try {
      await supabase
        .from('user_plans')
        .insert({
          user_id: newUserId,
          plan_type: 'free',
          api_requests: 1000
        });
    } catch (error) {
      console.error('Error creating user plan (non-critical):', error);
    }

    return new Response(
      JSON.stringify({
        message: 'Conta criada com sucesso!',
        user_id: newUserId,
        referral_code: newUserReferralCode,
        referral_processed: referralProcessed,
        bonus: referralProcessed ? 'Indicação registrada com sucesso!' : null
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Process referral error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
