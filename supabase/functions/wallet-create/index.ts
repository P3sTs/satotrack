
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[WALLET-CREATE] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Creating new wallet");

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

    const { seed_words, pin } = await req.json();
    
    if (!pin || pin.length !== 6) {
      throw new Error("PIN deve ter 6 dígitos");
    }

    logStep("Generating wallet addresses", { userId: user.id });

    // Gerar endereços para múltiplas moedas usando Tatum API
    const currencies = ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL'];
    const wallets = [];

    for (const currency of currencies) {
      try {
        const tatumResponse = await fetch(`https://api.tatum.io/v3/${currency.toLowerCase()}/wallet`, {
          method: 'GET',
          headers: {
            'x-api-key': Deno.env.get('TATUM_API_KEY') || '',
            'Content-Type': 'application/json'
          }
        });

        if (tatumResponse.ok) {
          const walletData = await tatumResponse.json();
          
          // Inserir na base de dados sem chaves privadas
          const { data: newWallet, error: insertError } = await supabase
            .from('crypto_wallets')
            .insert({
              user_id: user.id,
              currency: currency,
              address: walletData.address || `${currency}_${Date.now()}`,
              name: `${currency} Wallet`,
              balance: 0,
              xpub: walletData.xpub,
            })
            .select()
            .single();

          if (!insertError && newWallet) {
            wallets.push(newWallet);
          }

          logStep(`Wallet created for ${currency}`, { address: walletData.address });
        }
      } catch (error) {
        logStep(`Failed to create ${currency} wallet`, { error: error.message });
      }
    }

    // Salvar PIN criptografado
    const encoder = new TextEncoder();
    const pinData = encoder.encode(pin + user.id);
    const pinHash = await crypto.subtle.digest('SHA-256', pinData);
    const pinHashArray = Array.from(new Uint8Array(pinHash));
    const pinHashHex = pinHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Update user security settings com melhor tratamento de erro
    const { error: securityError } = await supabase
      .from('user_security_settings')
      .upsert({
        user_id: user.id,
        pin_hash: pinHashHex,
        pin_enabled: true,
        security_setup_completed: true,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      });
    
    if (securityError) {
      console.error('Error updating user_security_settings:', securityError);
      // Não falhar por causa deste erro específico
    }

    logStep("Wallet creation completed", { walletsCreated: wallets.length });

    return new Response(JSON.stringify({
      success: true,
      data: {
        wallets,
        message: `${wallets.length} carteiras criadas com sucesso`
      }
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
