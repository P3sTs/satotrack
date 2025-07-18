
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) {
      return new Response(JSON.stringify({
        success: false,
        authenticated: false,
        error: userError.message
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        authenticated: false,
        error: "User not found"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Buscar configurações de segurança
    const { data: securitySettings } = await supabase
      .from('user_security_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Buscar plano do usuário
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Contar carteiras do usuário
    const { count: walletsCount } = await supabase
      .from('crypto_wallets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Buscar últimas transações
    const { data: recentTransactions } = await supabase
      .from('crypto_transactions')
      .select('transaction_type, amount, currency, created_at, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const authInfo = {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        phone_confirmed_at: user.phone_confirmed_at
      },
      profile: profile || null,
      security: {
        pin_enabled: securitySettings?.pin_enabled || false,
        biometric_enabled: securitySettings?.biometric_enabled || false,
        security_setup_completed: securitySettings?.security_setup_completed || false,
        failed_attempts: securitySettings?.failed_attempts || 0,
        locked_until: securitySettings?.locked_until || null,
        last_successful_auth: securitySettings?.last_successful_auth || null
      },
      plan: {
        type: userPlan?.plan_type || 'free',
        api_requests: userPlan?.api_requests || 0,
        has_api_token: !!userPlan?.api_token
      },
      wallet_stats: {
        total_wallets: walletsCount || 0,
        recent_transactions: recentTransactions || []
      },
      session_info: {
        access_token_expires_at: user.app_metadata?.expires_at || null,
        provider: user.app_metadata?.provider || 'email',
        providers: user.app_metadata?.providers || []
      }
    };

    return new Response(JSON.stringify({
      success: true,
      authenticated: true,
      data: authInfo
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(JSON.stringify({ 
      success: false,
      authenticated: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
