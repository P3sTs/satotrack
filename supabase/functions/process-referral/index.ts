
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { email, password, referral_code, full_name } = await req.json();

    console.log('Processing referral registration for:', email, 'with code:', referral_code);

    // 1. Verificar se o código de indicação existe
    let referrerUserId = null;
    if (referral_code) {
      const { data: referrer, error: referrerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referral_code)
        .single();

      if (referrerError) {
        console.log('Referral code not found:', referral_code);
      } else {
        referrerUserId = referrer.id;
        console.log('Found referrer:', referrerUserId);
      }
    }

    // 2. Criar o novo usuário
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

    // 3. Se tiver indicação, registrar na tabela referrals
    if (referrerUserId && newUserId) {
      const { error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_user_id: referrerUserId,
          referred_user_id: newUserId,
          referred_user_email: email,
          status: 'completed'
        });

      if (referralError) {
        console.error('Error recording referral:', referralError);
      } else {
        console.log('Referral recorded successfully');

        // 4. Contar total de indicações do usuário
        const { data: referralCount, error: countError } = await supabase
          .from('referrals')
          .select('id', { count: 'exact' })
          .eq('referrer_user_id', referrerUserId)
          .eq('status', 'completed');

        if (!countError && referralCount) {
          const totalReferrals = referralCount.length;
          console.log('Total referrals for user:', totalReferrals);

          // 5. Atualizar total_referrals no perfil
          await supabase
            .from('profiles')
            .update({ total_referrals: totalReferrals })
            .eq('id', referrerUserId);

          // 6. Verificar se deve ganhar Premium (a cada 20 indicações)
          if (totalReferrals > 0 && totalReferrals % 20 === 0) {
            console.log('User earned Premium! Total referrals:', totalReferrals);

            // Buscar dados atuais do plano
            const { data: currentPlan } = await supabase
              .from('user_plans')
              .select('premium_until')
              .eq('user_id', referrerUserId)
              .single();

            // Calcular nova data de expiração
            const now = new Date();
            const currentExpiry = currentPlan?.premium_until ? new Date(currentPlan.premium_until) : now;
            const newExpiry = new Date(Math.max(now.getTime(), currentExpiry.getTime()));
            newExpiry.setMonth(newExpiry.getMonth() + 1);

            // Atualizar plano do usuário
            await supabase
              .from('user_plans')
              .upsert({
                user_id: referrerUserId,
                plan_type: 'premium',
                premium_until: newExpiry.toISOString(),
                updated_at: now.toISOString()
              });

            console.log('Premium granted until:', newExpiry);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Conta criada com sucesso!',
        user_id: newUserId,
        referral_processed: !!referrerUserId,
        bonus: referrerUserId ? 'Indicação registrada com sucesso!' : null
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Process referral error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
