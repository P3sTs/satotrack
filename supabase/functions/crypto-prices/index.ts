import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CRYPTO-PRICES] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { symbols = ['bitcoin', 'ethereum', 'matic-network', 'tether', 'solana'] } = await req.json();
    
    if (!symbols || !Array.isArray(symbols)) {
      throw new Error("symbols array é obrigatório");
    }

    logStep("Fetching prices for symbols", { symbols });

    // Usar CoinGecko API gratuita para preços
    const symbolsParam = symbols.join(',');
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${symbolsParam}&vs_currencies=usd,brl&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();
    logStep("Prices fetched successfully", { symbolCount: Object.keys(data).length });

    // Mapeamento de IDs para símbolos
    const symbolMap: Record<string, string> = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'matic-network': 'MATIC',
      'tether': 'USDT',
      'solana': 'SOL'
    };

    // Formatar dados para retorno padronizado
    const formattedData = Object.entries(data).map(([id, priceData]: [string, any]) => ({
      id,
      symbol: symbolMap[id] || id.toUpperCase(),
      name: id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' '),
      price_usd: priceData.usd || 0,
      price_brl: priceData.brl || 0,
      change_24h: priceData.usd_24h_change || 0,
      market_cap: priceData.usd_market_cap || 0,
      volume_24h: priceData.usd_24h_vol || 0,
      last_updated: new Date().toISOString()
    }));

    return new Response(JSON.stringify({
      success: true,
      data: formattedData,
      timestamp: new Date().toISOString()
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