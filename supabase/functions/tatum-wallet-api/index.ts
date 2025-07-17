import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[TATUM-WALLET-API] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const tatumApiKey = Deno.env.get("TATUM_API_KEY");
    if (!tatumApiKey) {
      throw new Error("TATUM_API_KEY não configurado");
    }

    const { action, blockchain, address, mnemonic, index } = await req.json();
    
    if (!action || !blockchain) {
      throw new Error("action e blockchain são obrigatórios");
    }

    logStep("Processing Tatum API request", { action, blockchain });

    const tatumBaseUrl = "https://api.tatum.io/v3";
    const headers = {
      "x-api-key": tatumApiKey,
      "Content-Type": "application/json"
    };

    let result;

    switch (action) {
      case 'generate_wallet':
        // Gerar carteira usando Tatum
        const walletResponse = await fetch(`${tatumBaseUrl}/${blockchain}/wallet`, {
          method: 'GET',
          headers
        });

        if (!walletResponse.ok) {
          throw new Error(`Tatum API error: ${walletResponse.statusText}`);
        }

        const walletData = await walletResponse.json();
        result = walletData;
        break;

      case 'generate_address':
        if (!mnemonic || index === undefined) {
          throw new Error("Para gerar endereço: mnemonic e index são obrigatórios");
        }

        const addressResponse = await fetch(`${tatumBaseUrl}/${blockchain}/address/${mnemonic}/${index}`, {
          method: 'GET',
          headers
        });

        if (!addressResponse.ok) {
          throw new Error(`Tatum API error: ${addressResponse.statusText}`);
        }

        const addressData = await addressResponse.json();
        result = addressData;
        break;

      case 'get_balance':
        if (!address) {
          throw new Error("Para obter saldo: address é obrigatório");
        }

        const balanceResponse = await fetch(`${tatumBaseUrl}/${blockchain}/address/balance/${address}`, {
          method: 'GET',
          headers
        });

        if (!balanceResponse.ok) {
          throw new Error(`Tatum API error: ${balanceResponse.statusText}`);
        }

        const balanceData = await balanceResponse.json();
        result = balanceData;
        break;

      case 'get_transactions':
        if (!address) {
          throw new Error("Para obter transações: address é obrigatório");
        }

        const txResponse = await fetch(`${tatumBaseUrl}/${blockchain}/transaction/address/${address}?pageSize=50`, {
          method: 'GET',
          headers
        });

        if (!txResponse.ok) {
          throw new Error(`Tatum API error: ${txResponse.statusText}`);
        }

        const txData = await txResponse.json();
        result = txData;
        break;

      default:
        throw new Error(`Ação não suportada: ${action}`);
    }

    logStep("Tatum API request completed successfully", { action, hasResult: !!result });

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