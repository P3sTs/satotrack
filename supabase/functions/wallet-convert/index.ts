
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
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { from_currency, to_currency, amount, preview_only = false } = await req.json();

    if (!from_currency || !to_currency || !amount) {
      throw new Error("Parâmetros obrigatórios: from_currency, to_currency, amount");
    }

    // Buscar taxas de conversão em tempo real
    let conversionRate = 1;
    let convertedAmount = parseFloat(amount);

    // Simulação de taxas (em produção usaria APIs como CoinGecko, Binance, etc.)
    const mockRates = {
      'BTC': { 'USD': 43000, 'BRL': 215000, 'ETH': 17.5 },
      'ETH': { 'USD': 2500, 'BRL': 12500, 'BTC': 0.057 },
      'USDT': { 'USD': 1, 'BRL': 5.0, 'BTC': 0.000023 },
      'USD': { 'BRL': 5.0, 'BTC': 0.000023, 'ETH': 0.0004 },
      'BRL': { 'USD': 0.2, 'BTC': 0.0000046, 'ETH': 0.00008 }
    };

    if (mockRates[from_currency] && mockRates[from_currency][to_currency]) {
      conversionRate = mockRates[from_currency][to_currency];
      convertedAmount = parseFloat(amount) * conversionRate;
    } else if (from_currency !== to_currency) {
      // Conversão via USD se não há taxa direta
      const usdRate = mockRates[from_currency]?.['USD'] || 1;
      const targetRate = mockRates['USD']?.[to_currency] || 1;
      conversionRate = usdRate * targetRate;
      convertedAmount = parseFloat(amount) * conversionRate;
    }

    const fee = convertedAmount * 0.005; // Taxa de 0.5%
    const finalAmount = convertedAmount - fee;

    const conversionPreview = {
      from_currency,
      to_currency,
      from_amount: parseFloat(amount),
      conversion_rate: conversionRate,
      converted_amount: convertedAmount,
      fee_percentage: 0.5,
      fee_amount: fee,
      final_amount: finalAmount,
      estimated_time: '2-5 minutos',
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos
    };

    if (preview_only) {
      return new Response(JSON.stringify({
        success: true,
        data: { preview: conversionPreview }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Executar conversão real
    const conversionId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Registrar transação de conversão
    const { error: txError } = await supabase
      .from('crypto_transactions')
      .insert({
        user_id: user.id,
        transaction_hash: conversionId,
        transaction_type: 'convert',
        from_address: 'conversion',
        to_address: 'conversion',
        amount: parseFloat(amount),
        currency: from_currency,
        status: 'completed',
        gas_fee: fee
      });

    if (txError) {
      throw new Error("Erro ao registrar conversão");
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        conversion_id: conversionId,
        ...conversionPreview,
        status: 'completed',
        completed_at: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
