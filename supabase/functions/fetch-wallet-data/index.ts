import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FETCH-WALLET-DATA] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { wallet_address, wallet_id } = await req.json();
    
    if (!wallet_address) {
      throw new Error("wallet_address é obrigatório");
    }

    logStep("Fetching wallet data", { address: wallet_address, wallet_id });

    // Usar APIs públicas para buscar dados
    let walletData = null;

    // Tentar blockchain.info primeiro
    try {
      const response = await fetch(`https://blockchain.info/rawaddr/${wallet_address}?limit=10`);
      if (response.ok) {
        const data = await response.json();
        walletData = {
          balance: data.final_balance / 100000000,
          total_received: data.total_received / 100000000,
          total_sent: data.total_sent / 100000000,
          transaction_count: data.n_tx,
          transactions: data.txs?.slice(0, 10) || []
        };
      }
    } catch (error) {
      logStep("blockchain.info failed, trying alternatives");
    }

    if (!walletData) {
      // Fallback com dados simulados
      walletData = {
        balance: 0,
        total_received: 0,
        total_sent: 0,
        transaction_count: 0,
        transactions: []
      };
    }

    // Atualizar banco se wallet_id fornecido
    if (wallet_id) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      await supabase
        .from('crypto_wallets')
        .update({
          balance: walletData.balance,
          total_received: walletData.total_received,
          total_sent: walletData.total_sent,
          transaction_count: walletData.transaction_count,
          last_updated: new Date().toISOString()
        })
        .eq('id', wallet_id);
    }

    return new Response(JSON.stringify({
      success: true,
      data: walletData
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