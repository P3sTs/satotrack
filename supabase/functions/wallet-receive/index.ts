
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

    const { wallet_id, amount } = await req.json();

    // Buscar carteira
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select('*')
      .eq('id', wallet_id)
      .eq('user_id', user.id)
      .single();

    if (walletError || !wallet) {
      throw new Error("Carteira não encontrada");
    }

    // Gerar QR Code URL
    const qrData = amount 
      ? `${wallet.currency}:${wallet.address}?amount=${amount}`
      : wallet.address;
    
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    // Gerar informações de recebimento
    const receiveInfo = {
      address: wallet.address,
      currency: wallet.currency,
      network: wallet.currency === 'USDT' ? 'Ethereum (ERC-20)' : wallet.currency,
      qr_code_url: qrCodeUrl,
      qr_data: qrData,
      amount: amount || null,
      instructions: [
        `Envie ${wallet.currency} para este endereço`,
        'Verifique se está enviando na rede correta',
        'Aguarde confirmações da rede',
        amount ? `Valor solicitado: ${amount} ${wallet.currency}` : 'Qualquer valor pode ser enviado'
      ],
      warning: 'Não envie outras moedas para este endereço',
      estimated_arrival: '5-30 minutos dependendo da rede'
    };

    return new Response(JSON.stringify({
      success: true,
      data: receiveInfo
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
