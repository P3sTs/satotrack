import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SECURE-WALLET-OPS] ${step}${detailsStr}`);
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

    const { operation, wallet_id, amount, to_address, currency } = await req.json();
    
    if (!operation || !wallet_id) {
      throw new Error("operation e wallet_id são obrigatórios");
    }

    logStep("Processing secure wallet operation", { operation, wallet_id, userId: user.id });

    // Verificar se a carteira pertence ao usuário
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select('*')
      .eq('id', wallet_id)
      .eq('user_id', user.id)
      .single();

    if (walletError || !wallet) {
      throw new Error("Carteira não encontrada ou não autorizada");
    }

    let result;

    switch (operation) {
      case 'send':
        if (!amount || !to_address || !currency) {
          throw new Error("Para envio: amount, to_address e currency são obrigatórios");
        }

        // Validar se há saldo suficiente
        if (wallet.balance < amount) {
          throw new Error("Saldo insuficiente para esta transação");
        }

        // Registrar log de segurança
        await supabase
          .from('security_logs')
          .insert({
            user_id: user.id,
            event_type: 'wallet_send_attempt',
            details: {
              wallet_id,
              amount,
              to_address,
              currency,
              timestamp: new Date().toISOString()
            }
          });

        // Simular transação (em produção, integraria com APIs reais)
        result = {
          transaction_id: `sim_${Date.now()}`,
          status: 'pending',
          amount,
          to_address,
          currency,
          fee: amount * 0.001, // Taxa simulada
          estimated_confirmation: '10-15 minutes'
        };

        logStep("Send operation simulated", { transaction_id: result.transaction_id });
        break;

      case 'receive':
        // Gerar novo endereço de recebimento (simulado)
        result = {
          address: wallet.address,
          qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${wallet.address}`,
          currency: wallet.currency,
          note: 'Use este endereço para receber pagamentos'
        };

        logStep("Receive address generated", { address: result.address });
        break;

      case 'backup':
        // Gerar informações de backup (ATENÇÃO: Em produção, isso seria muito mais complexo)
        result = {
          backup_phrase: 'NEVER_STORE_REAL_SEEDS_HERE',
          backup_date: new Date().toISOString(),
          warning: 'Este é apenas um exemplo. NUNCA armazene seeds reais em logs ou APIs.',
          instructions: [
            'Anote a frase de recuperação em papel',
            'Guarde em local seguro e privado',
            'Nunca compartilhe com terceiros',
            'Verifique regularmente o backup'
          ]
        };

        // Registrar log de backup
        await supabase
          .from('security_logs')
          .insert({
            user_id: user.id,
            event_type: 'wallet_backup_generated',
            details: {
              wallet_id,
              timestamp: new Date().toISOString()
            }
          });

        logStep("Backup information generated", { wallet_id });
        break;

      default:
        throw new Error(`Operação não suportada: ${operation}`);
    }

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