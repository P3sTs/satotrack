
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

    const url = new URL(req.url);
    const wallet_id = url.searchParams.get('wallet_id');
    const currency = url.searchParams.get('currency');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = supabase
      .from('crypto_transactions')
      .select(`
        *,
        crypto_wallets!wallet_id (
          currency,
          address,
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (wallet_id) {
      query = query.eq('wallet_id', wallet_id);
    }

    if (currency) {
      query = query.eq('currency', currency);
    }

    const { data: transactions, error: txError } = await query;

    if (txError) {
      throw new Error("Erro ao buscar histórico de transações");
    }

    // Formatar transações para resposta
    const formattedTransactions = (transactions || []).map(tx => ({
      id: tx.id,
      transaction_hash: tx.transaction_hash,
      type: tx.transaction_type,
      currency: tx.currency,
      amount: tx.amount,
      from_address: tx.from_address,
      to_address: tx.to_address,
      status: tx.status,
      gas_fee: tx.gas_fee,
      block_number: tx.block_number,
      created_at: tx.created_at,
      confirmed_at: tx.confirmed_at,
      wallet: tx.crypto_wallets ? {
        currency: tx.crypto_wallets.currency,
        address: tx.crypto_wallets.address,
        name: tx.crypto_wallets.name
      } : null
    }));

    // Estatísticas do período
    const stats = {
      total_transactions: formattedTransactions.length,
      total_sent: formattedTransactions
        .filter(tx => tx.type === 'send')
        .reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0),
      total_received: formattedTransactions
        .filter(tx => tx.type === 'receive')
        .reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0),
      total_fees: formattedTransactions
        .reduce((sum, tx) => sum + parseFloat(tx.gas_fee || '0'), 0),
      pending_count: formattedTransactions
        .filter(tx => tx.status === 'pending').length,
      completed_count: formattedTransactions
        .filter(tx => tx.status === 'completed').length
    };

    return new Response(JSON.stringify({
      success: true,
      data: {
        transactions: formattedTransactions,
        stats,
        pagination: {
          limit,
          offset,
          has_more: formattedTransactions.length === limit
        }
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
