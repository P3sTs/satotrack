
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

    const { seed_phrase, wallet_name, pin } = await req.json();

    if (!seed_phrase || !pin) {
      throw new Error("Seed phrase e PIN são obrigatórios");
    }

    if (pin.length !== 6) {
      throw new Error("PIN deve ter 6 dígitos");
    }

    // Verificar PIN
    const { data: securitySettings } = await supabase
      .from('user_security_settings')
      .select('pin_hash')
      .eq('user_id', user.id)
      .single();

    const encoder = new TextEncoder();
    const pinData = encoder.encode(pin + user.id);
    const pinHash = await crypto.subtle.digest('SHA-256', pinData);
    const pinHashArray = Array.from(new Uint8Array(pinHash));
    const pinHashHex = pinHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (!securitySettings || securitySettings.pin_hash !== pinHashHex) {
      throw new Error("PIN incorreto");
    }

    // Validar seed phrase (12 ou 24 palavras)
    const words = seed_phrase.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      throw new Error("Seed phrase deve ter 12 ou 24 palavras");
    }

    console.log(`Importando carteira com ${words.length} palavras`);

    // Simular importação de carteira externa
    // Em produção, usaria bibliotecas como bip39 para validar e derivar endereços
    const importedWallets = [];
    const currencies = ['BTC', 'ETH', 'MATIC', 'USDT'];

    for (const currency of currencies) {
      try {
        // Simular derivação de endereço
        const mockAddress = `${currency.toLowerCase()}_imported_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        // Buscar saldo via Tatum (se disponível)
        let balance = 0;
        try {
          const tatumResponse = await fetch(
            `https://api.tatum.io/v3/${currency.toLowerCase()}/address/balance/${mockAddress}`,
            {
              headers: {
                'x-api-key': Deno.env.get('TATUM_API_KEY') || '',
              }
            }
          );

          if (tatumResponse.ok) {
            const balanceData = await tatumResponse.json();
            balance = balanceData.balance || 0;
          }
        } catch (e) {
          console.log(`Erro ao buscar saldo ${currency}:`, e.message);
        }

        // Inserir carteira importada
        const { data: newWallet, error: insertError } = await supabase
          .from('crypto_wallets')
          .insert({
            user_id: user.id,
            currency: currency,
            address: mockAddress,
            name: wallet_name || `${currency} Importada`,
            balance: balance,
            address_type: 'imported'
          })
          .select()
          .single();

        if (!insertError && newWallet) {
          importedWallets.push(newWallet);
        }
      } catch (error) {
        console.log(`Erro ao importar ${currency}:`, error.message);
      }
    }

    // Log de segurança
    await supabase
      .from('security_logs')
      .insert({
        user_id: user.id,
        event_type: 'wallet_import',
        details: {
          imported_currencies: currencies,
          wallets_count: importedWallets.length,
          seed_words_count: words.length,
          timestamp: new Date().toISOString()
        }
      });

    return new Response(JSON.stringify({
      success: true,
      data: {
        imported_wallets: importedWallets,
        message: `${importedWallets.length} carteiras importadas com sucesso`,
        currencies_imported: importedWallets.map(w => w.currency)
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
