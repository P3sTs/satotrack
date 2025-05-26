
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to fetch data from Blockchain.info API
async function fetchBlockchainInfo(address: string) {
  try {
    const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=10`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('blockchain.info API error:', error);
    return null;
  }
}

// Function to fetch data from BlockCypher API as fallback
async function fetchBlockCypher(address: string) {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('BlockCypher API error:', error);
    return null;
  }
}

// Process blockchain.info data
function processBlockchainInfoData(data: any) {
  const transactions = data.txs.map((tx: any) => {
    // Determine if this transaction was incoming or outgoing
    let isIncoming = false;
    let totalValue = 0;

    // Check if any outputs were to our address
    for (const output of tx.out) {
      if (output.addr === data.address) {
        isIncoming = true;
        totalValue += output.value / 100000000; // Convert satoshis to BTC
      }
    }

    // If not incoming, it's outgoing (or could be both, but we simplify)
    if (!isIncoming) {
      for (const input of tx.inputs) {
        if (input.prev_out && input.prev_out.addr === data.address) {
          totalValue += input.prev_out.value / 100000000; // Convert satoshis to BTC
        }
      }
    }

    return {
      hash: tx.hash,
      amount: totalValue,
      transaction_type: isIncoming ? 'entrada' : 'saida',
      transaction_date: new Date(tx.time * 1000).toISOString()
    };
  });

  return {
    balance: data.final_balance / 100000000, // Convert satoshis to BTC
    total_received: data.total_received / 100000000,
    total_sent: data.total_sent / 100000000,
    transaction_count: data.n_tx,
    transactions
  };
}

// Process BlockCypher data
function processBlockCypherData(data: any) {
  // Extract transactions from txrefs if available
  const transactions = data.txrefs ? data.txrefs.map((tx: any) => {
    return {
      hash: tx.tx_hash,
      amount: Math.abs(tx.value / 100000000), // Convert satoshis to BTC
      transaction_type: tx.spent ? 'saida' : 'entrada',
      transaction_date: new Date(tx.confirmed).toISOString()
    };
  }) : [];

  return {
    balance: data.balance / 100000000, // Convert satoshis to BTC
    total_received: data.total_received / 100000000,
    total_sent: data.total_sent / 100000000,
    transaction_count: data.n_tx,
    transactions
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { address, wallet_id } = await req.json();
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Bitcoin address is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Try blockchain.info first
    let data = await fetchBlockchainInfo(address);
    let processedData;
    
    if (data) {
      processedData = processBlockchainInfoData(data);
    } else {
      // If blockchain.info fails, try BlockCypher
      data = await fetchBlockCypher(address);
      
      if (!data) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch data from any API' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      processedData = processBlockCypherData(data);
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (wallet_id) {
      // Update wallet data in Supabase using the correct table
      const { error: updateError } = await supabase
        .from('crypto_wallets')
        .update({
          balance: processedData.balance,
          total_received: processedData.total_received,
          total_sent: processedData.total_sent,
          transaction_count: processedData.transaction_count,
          last_updated: new Date().toISOString()
        })
        .eq('id', wallet_id);
      
      if (updateError) {
        console.error('Error updating wallet:', updateError);
      }

      // Store new transactions
      if (processedData.transactions && processedData.transactions.length > 0) {
        const { error: txError } = await supabase
          .from('wallet_transactions')
          .upsert(
            processedData.transactions.map((tx: any) => ({
              wallet_id,
              hash: tx.hash,
              amount: tx.amount,
              transaction_type: tx.transaction_type,
              transaction_date: tx.transaction_date
            })),
            { onConflict: 'wallet_id,hash' }
          );
        
        if (txError) {
          console.error('Error storing transactions:', txError);
        }
      }
    }

    return new Response(
      JSON.stringify(processedData),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
