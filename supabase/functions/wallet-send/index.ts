
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

    const { wallet_id, to_address, amount, pin } = await req.json();

    if (!wallet_id || !to_address || !amount || !pin) {
      throw new Error("Dados obrigatórios: wallet_id, to_address, amount, pin");
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

    // Verificar saldo
    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      throw new Error("Saldo insuficiente");
    }

    // Simular transação (em produção usaria Tatum KMS)
    const transactionId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Registrar transação
    const { data: transaction, error: txError } = await supabase
      .from('crypto_transactions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        transaction_hash: transactionId,
        transaction_type: 'send',
        from_address: wallet.address,
        to_address: to_address,
        amount: parseFloat(amount),
        currency: wallet.currency,
        status: 'pending',
        gas_fee: parseFloat(amount) * 0.001 // Taxa simulada
      })
      .select()
      .single();

    if (txError) {
      throw new Error("Erro ao registrar transação");
    }

    // Atualizar saldo da carteira
    const newBalance = parseFloat(wallet.balance) - parseFloat(amount) - (parseFloat(amount) * 0.001);
    await supabase
      .from('crypto_wallets')
      .update({
        balance: newBalance,
        total_sent: (parseFloat(wallet.total_sent) || 0) + parseFloat(amount),
        transaction_count: (wallet.transaction_count || 0) + 1,
        last_updated: new Date().toISOString()
      })
      .eq('id', wallet.id);

    // Log de segurança
    await supabase
      .from('security_logs')
      .insert({
        user_id: user.id,
        event_type: 'wallet_send',
        details: {
          wallet_id,
          amount,
          to_address,
          transaction_id: transactionId,
          timestamp: new Date().toISOString()
        }
      });

    return new Response(JSON.stringify({
      success: true,
      data: {
        transaction_id: transactionId,
        status: 'pending',
        amount: parseFloat(amount),
        to_address,
        from_address: wallet.address,
        currency: wallet.currency,
        gas_fee: parseFloat(amount) * 0.001,
        estimated_confirmation: '10-15 minutes',
        new_balance: newBalance
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
