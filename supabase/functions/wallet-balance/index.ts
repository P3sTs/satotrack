
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

    const { wallet_id, currency } = await req.json();

    // Buscar carteira do usuário
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select('*')
      .eq('id', wallet_id || null)
      .eq('user_id', user.id)
      .single();

    if (walletError && !currency) {
      throw new Error("Carteira não encontrada");
    }

    let balances = [];

    if (wallet_id && wallet) {
      // Buscar saldo específico da carteira
      try {
        const tatumResponse = await fetch(
          `https://api.tatum.io/v3/${wallet.currency.toLowerCase()}/address/balance/${wallet.address}`,
          {
            headers: {
              'x-api-key': Deno.env.get('TATUM_API_KEY') || '',
            }
          }
        );

        if (tatumResponse.ok) {
          const balanceData = await tatumResponse.json();
          
          // Atualizar saldo no banco
          await supabase
            .from('crypto_wallets')
            .update({
              balance: balanceData.balance || wallet.balance,
              last_updated: new Date().toISOString()
            })
            .eq('id', wallet.id);

          balances.push({
            currency: wallet.currency,
            balance: balanceData.balance || wallet.balance,
            address: wallet.address,
            usd_value: 0 // Será calculado em tempo real
          });
        }
      } catch (error) {
        console.log('Erro ao buscar saldo:', error);
        balances.push({
          currency: wallet.currency,
          balance: wallet.balance,
          address: wallet.address,
          usd_value: 0
        });
      }
    } else {
      // Buscar todas as carteiras do usuário
      const { data: wallets, error: walletsError } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user.id);

      if (!walletsError && wallets) {
        for (const wallet of wallets) {
          try {
            const tatumResponse = await fetch(
              `https://api.tatum.io/v3/${wallet.currency.toLowerCase()}/address/balance/${wallet.address}`,
              {
                headers: {
                  'x-api-key': Deno.env.get('TATUM_API_KEY') || '',
                }
              }
            );

            let balance = wallet.balance;
            if (tatumResponse.ok) {
              const balanceData = await tatumResponse.json();
              balance = balanceData.balance || wallet.balance;
              
              // Atualizar no banco
              await supabase
                .from('crypto_wallets')
                .update({
                  balance: balance,
                  last_updated: new Date().toISOString()
                })
                .eq('id', wallet.id);
            }

            balances.push({
              id: wallet.id,
              currency: wallet.currency,
              balance: balance,
              address: wallet.address,
              usd_value: 0
            });
          } catch (error) {
            balances.push({
              id: wallet.id,
              currency: wallet.currency,
              balance: wallet.balance,
              address: wallet.address,
              usd_value: 0
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      data: { balances }
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
