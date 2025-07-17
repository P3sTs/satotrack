import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CRYPTO-WALLET-MANAGER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

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
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { action, wallet_data } = await req.json();
    
    if (!action) {
      throw new Error("action é obrigatório");
    }

    logStep("Processing wallet action", { action, userId: user.id });

    let result;

    switch (action) {
      case 'create':
        if (!wallet_data?.currency || !wallet_data?.address || !wallet_data?.name) {
          throw new Error("Para criar carteira: currency, address e name são obrigatórios");
        }

        const { data: newWallet, error: createError } = await supabase
          .from('crypto_wallets')
          .insert({
            user_id: user.id,
            currency: wallet_data.currency,
            address: wallet_data.address,
            name: wallet_data.name,
            balance: wallet_data.balance || 0,
            total_received: wallet_data.total_received || 0,
            total_sent: wallet_data.total_sent || 0,
            transaction_count: wallet_data.transaction_count || 0
          })
          .select()
          .single();

        if (createError) throw createError;
        result = { wallet: newWallet };
        break;

      case 'update':
        if (!wallet_data?.id) {
          throw new Error("Para atualizar carteira: id é obrigatório");
        }

        const { data: updatedWallet, error: updateError } = await supabase
          .from('crypto_wallets')
          .update({
            balance: wallet_data.balance,
            total_received: wallet_data.total_received,
            total_sent: wallet_data.total_sent,
            transaction_count: wallet_data.transaction_count,
            last_updated: new Date().toISOString()
          })
          .eq('id', wallet_data.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = { wallet: updatedWallet };
        break;

      case 'delete':
        if (!wallet_data?.id) {
          throw new Error("Para deletar carteira: id é obrigatório");
        }

        const { error: deleteError } = await supabase
          .from('crypto_wallets')
          .delete()
          .eq('id', wallet_data.id)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
        result = { success: true };
        break;

      case 'list':
        const { data: wallets, error: listError } = await supabase
          .from('crypto_wallets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (listError) throw listError;
        result = { wallets };
        break;

      default:
        throw new Error(`Ação não suportada: ${action}`);
    }

    logStep("Action completed successfully", { action, result: !!result });

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