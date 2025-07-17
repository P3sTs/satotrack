import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-REFERRAL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { referral_code, referred_user_id } = await req.json();
    
    if (!referral_code || !referred_user_id) {
      throw new Error("referral_code e referred_user_id são obrigatórios");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    logStep("Processing referral", { referral_code, referred_user_id });

    // Executar a função do banco de dados para processar referral
    const { error: processError } = await supabase
      .rpc('process_referral', {
        referrer_code: referral_code,
        referred_user_id: referred_user_id
      });

    if (processError) {
      throw new Error(`Erro ao processar referral: ${processError.message}`);
    }

    // Buscar informações atualizadas do referenciador
    const { data: referrerProfile, error: referrerError } = await supabase
      .from('profiles')
      .select('id, full_name, referral_count, premium_status, premium_expiry')
      .eq('referral_code', referral_code)
      .single();

    if (referrerError) {
      logStep("Warning: Could not fetch referrer profile", { error: referrerError.message });
    }

    // Buscar informações do usuário referido
    const { data: referredProfile, error: referredError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', referred_user_id)
      .single();

    if (referredError) {
      logStep("Warning: Could not fetch referred user profile", { error: referredError.message });
    }

    const result = {
      success: true,
      referrer: referrerProfile ? {
        id: referrerProfile.id,
        name: referrerProfile.full_name,
        referral_count: referrerProfile.referral_count,
        premium_status: referrerProfile.premium_status,
        premium_expiry: referrerProfile.premium_expiry
      } : null,
      referred_user: referredProfile ? {
        id: referredProfile.id,
        name: referredProfile.full_name
      } : null,
      rewards_earned: referrerProfile?.referral_count && referrerProfile.referral_count % 20 === 0
    };

    logStep("Referral processed successfully", { 
      referral_count: referrerProfile?.referral_count,
      rewards_earned: result.rewards_earned
    });

    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});