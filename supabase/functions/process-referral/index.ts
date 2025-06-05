
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

    // 2. Criar perfil do usuário (o trigger vai gerar o código automaticamente)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUserId,
        full_name: full_name || '',
        referred_by: referral_code || null
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar perfil: ' + profileError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 3. Se tiver código de referência, processar a indicação
    if (referral_code) {
      const { error: referralError } = await supabase.rpc('process_referral', {
        referrer_code: referral_code,
        referred_user_id: newUserId
      });

      if (referralError) {
        console.error('Error processing referral:', referralError);
        // Não falha a criação da conta por causa disso
      } else {
        console.log('Referral processed successfully');
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Conta criada com sucesso!',
        user_id: newUserId,
        referral_processed: !!referral_code,
        bonus: referral_code ? 'Indicação registrada com sucesso!' : null
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
