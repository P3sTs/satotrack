
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface WalletRequest {
  address: string;
  wallet_id?: string;
}

interface BlockchainApiResponse {
  balance: number;
  total_received: number;
  total_sent: number;
  transaction_count: number;
  last_updated: string;
  transactions?: any[];
}

serve(async (req) => {
  try {
    // Get request parameters
    const { address, wallet_id } = await req.json() as WalletRequest;

    if (!address) {
      return new Response(
        JSON.stringify({ error: "Endereço Bitcoin não fornecido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // First attempt - BlockCypher API
    let data: BlockchainApiResponse | null = await fetchBlockCypherData(address);
    
    // Fallback to mempool.space if BlockCypher fails
    if (!data) {
      data = await fetchMempoolData(address);
    }

    // If we have wallet_id, store data in database
    if (wallet_id && data) {
      await updateWalletData(wallet_id, data);
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-wallet-data:", error);
    
    return new Response(
      JSON.stringify({ error: "Falha ao processar dados da carteira Bitcoin" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

async function fetchBlockCypherData(address: string): Promise<BlockchainApiResponse | null> {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}?limit=5`);
    
    if (!response.ok) {
      throw new Error(`BlockCypher API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and normalize BlockCypher data
    return {
      balance: data.balance / 100000000, // Convert satoshis to BTC
      total_received: data.total_received / 100000000,
      total_sent: data.total_sent / 100000000,
      transaction_count: data.n_tx,
      last_updated: new Date().toISOString(),
      transactions: data.txrefs?.map((tx: any) => ({
        hash: tx.tx_hash,
        amount: tx.value / 100000000,
        transaction_type: tx.tx_input_n === -1 ? 'entrada' : 'saida',
        transaction_date: new Date(tx.confirmed).toISOString()
      })) || []
    };
  } catch (error) {
    console.error("Error fetching from BlockCypher:", error);
    return null;
  }
}

async function fetchMempoolData(address: string): Promise<BlockchainApiResponse | null> {
  try {
    const response = await fetch(`https://mempool.space/api/address/${address}`);
    
    if (!response.ok) {
      throw new Error(`mempool.space API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Fetch transaction data
    const txResponse = await fetch(`https://mempool.space/api/address/${address}/txs`);
    const txs = txResponse.ok ? await txResponse.json() : [];
    
    // Process and normalize mempool data
    return {
      balance: data.chain_stats.funded_txo_sum / 100000000 - data.chain_stats.spent_txo_sum / 100000000,
      total_received: data.chain_stats.funded_txo_sum / 100000000,
      total_sent: data.chain_stats.spent_txo_sum / 100000000,
      transaction_count: data.chain_stats.tx_count,
      last_updated: new Date().toISOString(),
      transactions: txs.slice(0, 5).map((tx: any) => {
        // Processing transactions requires more complex logic for mempool
        // Simplified version for PoC
        const isReceiving = tx.vout.some((v: any) => v.scriptpubkey_address === address);
        return {
          hash: tx.txid,
          amount: tx.value / 100000000,
          transaction_type: isReceiving ? 'entrada' : 'saida',
          transaction_date: new Date(tx.status.block_time * 1000).toISOString()
        };
      })
    };
  } catch (error) {
    console.error("Error fetching from mempool.space:", error);
    return null;
  }
}

async function updateWalletData(wallet_id: string, data: BlockchainApiResponse) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Update wallet data
  await supabase
    .from('bitcoin_wallets')
    .update({
      balance: data.balance,
      total_received: data.total_received,
      total_sent: data.total_sent,
      transaction_count: data.transaction_count,
      last_updated: data.last_updated
    })
    .eq('id', wallet_id);
  
  // Store latest transactions if available
  if (data.transactions && data.transactions.length > 0) {
    for (const tx of data.transactions) {
      // Check if transaction already exists
      const { data: existingTx } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet_id)
        .eq('hash', tx.hash)
        .single();
      
      if (!existingTx) {
        // Insert new transaction
        await supabase
          .from('wallet_transactions')
          .insert({
            wallet_id,
            hash: tx.hash,
            amount: tx.amount,
            transaction_type: tx.transaction_type,
            transaction_date: tx.transaction_date
          });
      }
    }
  }
}
