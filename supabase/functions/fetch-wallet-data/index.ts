
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
    console.log(`Fetching data from blockchain.info for address: ${address}`);
    const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=50`);
    if (!response.ok) {
      throw new Error(`blockchain.info API error: ${response.status}`);
    }
    const data = await response.json();
    console.log(`blockchain.info response:`, data);
    return data;
  } catch (error) {
    console.error('blockchain.info API error:', error);
    return null;
  }
}

// Function to fetch data from BlockCypher API as fallback
async function fetchBlockCypher(address: string) {
  try {
    console.log(`Fetching data from BlockCypher for address: ${address}`);
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}?limit=50&includeScript=true`);
    if (!response.ok) {
      throw new Error(`BlockCypher API error: ${response.status}`);
    }
    const data = await response.json();
    console.log(`BlockCypher response:`, data);
    return data;
  } catch (error) {
    console.error('BlockCypher API error:', error);
    return null;
  }
}

// Function to fetch data from Blockstream API as alternative
async function fetchBlockstream(address: string) {
  try {
    console.log(`Fetching data from Blockstream for address: ${address}`);
    const [addressResponse, txsResponse] = await Promise.all([
      fetch(`https://blockstream.info/api/address/${address}`),
      fetch(`https://blockstream.info/api/address/${address}/txs`)
    ]);
    
    if (!addressResponse.ok || !txsResponse.ok) {
      throw new Error(`Blockstream API error`);
    }
    
    const addressData = await addressResponse.json();
    const txsData = await txsResponse.json();
    
    console.log(`Blockstream address data:`, addressData);
    console.log(`Blockstream transactions:`, txsData);
    
    return { addressData, txsData };
  } catch (error) {
    console.error('Blockstream API error:', error);
    return null;
  }
}

// Process blockchain.info data with enhanced transaction extraction
function processBlockchainInfoData(data: any, targetAddress: string) {
  console.log(`Processing blockchain.info data for address: ${targetAddress}`);
  
  const transactions = data.txs.map((tx: any) => {
    let totalValueIn = 0;
    let totalValueOut = 0;
    let isIncoming = false;
    let isOutgoing = false;

    // Check inputs (saídas de outras carteiras para esta)
    if (tx.inputs) {
      tx.inputs.forEach((input: any) => {
        if (input.prev_out && input.prev_out.addr === targetAddress) {
          totalValueOut += input.prev_out.value / 100000000; // Convert satoshis to BTC
          isOutgoing = true;
        }
      });
    }

    // Check outputs (entradas para esta carteira)
    if (tx.out) {
      tx.out.forEach((output: any) => {
        if (output.addr === targetAddress) {
          totalValueIn += output.value / 100000000; // Convert satoshis to BTC
          isIncoming = true;
        }
      });
    }

    // Determine transaction type and amount
    let transactionType: string;
    let amount: number;
    
    if (isIncoming && isOutgoing) {
      // Self-transaction or change
      amount = totalValueIn - totalValueOut;
      transactionType = amount > 0 ? 'entrada' : 'saida';
    } else if (isIncoming) {
      amount = totalValueIn;
      transactionType = 'entrada';
    } else if (isOutgoing) {
      amount = totalValueOut;
      transactionType = 'saida';
    } else {
      // Not related to this address
      return null;
    }

    return {
      hash: tx.hash,
      amount: Math.abs(amount),
      transaction_type: transactionType,
      transaction_date: new Date(tx.time * 1000).toISOString(),
      fee: tx.fee ? tx.fee / 100000000 : 0,
      confirmations: tx.confirmations || 0,
      block_height: tx.block_height || null,
      size: tx.size || 0
    };
  }).filter((tx: any) => tx !== null);

  console.log(`Processed ${transactions.length} transactions from blockchain.info`);

  return {
    balance: data.final_balance / 100000000,
    total_received: data.total_received / 100000000,
    total_sent: data.total_sent / 100000000,
    transaction_count: data.n_tx,
    unconfirmed_balance: (data.final_balance - (data.final_balance - (data.unconfirmed_balance || 0))) / 100000000,
    transactions
  };
}

// Process BlockCypher data with enhanced transaction extraction
function processBlockCypherData(data: any, targetAddress: string) {
  console.log(`Processing BlockCypher data for address: ${targetAddress}`);
  
  const transactions = (data.txrefs || []).map((tx: any) => {
    return {
      hash: tx.tx_hash,
      amount: Math.abs(tx.value) / 100000000,
      transaction_type: tx.tx_output_n >= 0 ? 'entrada' : 'saida',
      transaction_date: new Date(tx.confirmed).toISOString(),
      confirmations: tx.confirmations || 0,
      block_height: tx.block_height || null,
      double_spend: tx.double_spend || false
    };
  });

  console.log(`Processed ${transactions.length} transactions from BlockCypher`);

  return {
    balance: data.balance / 100000000,
    total_received: data.total_received / 100000000,
    total_sent: data.total_sent / 100000000,
    transaction_count: data.n_tx,
    unconfirmed_balance: data.unconfirmed_balance / 100000000,
    transactions
  };
}

// Process Blockstream data with enhanced transaction extraction
function processBlockstreamData(result: any, targetAddress: string) {
  console.log(`Processing Blockstream data for address: ${targetAddress}`);
  
  const { addressData, txsData } = result;
  
  const transactions = txsData.map((tx: any) => {
    let totalValueIn = 0;
    let totalValueOut = 0;
    let isIncoming = false;
    let isOutgoing = false;

    // Check inputs
    if (tx.vin) {
      tx.vin.forEach((input: any) => {
        if (input.prevout && input.prevout.scriptpubkey_address === targetAddress) {
          totalValueOut += input.prevout.value / 100000000;
          isOutgoing = true;
        }
      });
    }

    // Check outputs
    if (tx.vout) {
      tx.vout.forEach((output: any) => {
        if (output.scriptpubkey_address === targetAddress) {
          totalValueIn += output.value / 100000000;
          isIncoming = true;
        }
      });
    }

    let transactionType: string;
    let amount: number;
    
    if (isIncoming && isOutgoing) {
      amount = totalValueIn - totalValueOut;
      transactionType = amount > 0 ? 'entrada' : 'saida';
    } else if (isIncoming) {
      amount = totalValueIn;
      transactionType = 'entrada';
    } else if (isOutgoing) {
      amount = totalValueOut;
      transactionType = 'saida';
    } else {
      return null;
    }

    return {
      hash: tx.txid,
      amount: Math.abs(amount),
      transaction_type: transactionType,
      transaction_date: new Date(tx.status.block_time * 1000).toISOString(),
      confirmations: tx.status.confirmed ? 1 : 0,
      block_height: tx.status.block_height || null,
      fee: tx.fee ? tx.fee / 100000000 : 0,
      size: tx.size || 0,
      weight: tx.weight || 0
    };
  }).filter((tx: any) => tx !== null);

  console.log(`Processed ${transactions.length} transactions from Blockstream`);

  return {
    balance: (addressData.chain_stats.funded_txo_sum - addressData.chain_stats.spent_txo_sum) / 100000000,
    total_received: addressData.chain_stats.funded_txo_sum / 100000000,
    total_sent: addressData.chain_stats.spent_txo_sum / 100000000,
    transaction_count: addressData.chain_stats.tx_count,
    unconfirmed_balance: (addressData.mempool_stats.funded_txo_sum - addressData.mempool_stats.spent_txo_sum) / 100000000,
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

    console.log(`Starting data fetch for address: ${address}`);
    
    let processedData;
    
    // Try blockchain.info first (most comprehensive)
    let data = await fetchBlockchainInfo(address);
    if (data) {
      console.log('Using blockchain.info data');
      processedData = processBlockchainInfoData(data, address);
    } else {
      // Try Blockstream as second option
      data = await fetchBlockstream(address);
      if (data) {
        console.log('Using Blockstream data');
        processedData = processBlockstreamData(data, address);
      } else {
        // Try BlockCypher as last resort
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
        console.log('Using BlockCypher data');
        processedData = processBlockCypherData(data, address);
      }
    }

    console.log(`Final processed data:`, processedData);

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (wallet_id) {
      console.log(`Updating wallet ${wallet_id} in database`);
      
      // Update wallet data in Supabase
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
      } else {
        console.log('Wallet updated successfully');
      }

      // Store new transactions
      if (processedData.transactions && processedData.transactions.length > 0) {
        console.log(`Storing ${processedData.transactions.length} transactions`);
        
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
        } else {
          console.log('Transactions stored successfully');
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
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
