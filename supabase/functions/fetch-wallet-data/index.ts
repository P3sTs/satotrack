
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

// CORS Headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Get request parameters
    const requestData = await req.json().catch(error => {
      console.error("Error parsing request JSON:", error);
      return {};
    });
    
    const { address, wallet_id } = requestData as WalletRequest;

    if (!address) {
      return new Response(
        JSON.stringify({ error: "Endereço Bitcoin não fornecido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Buscando dados da carteira: ${address}`);
    
    // Tentativa com múltiplas APIs para garantir resiliência
    // First attempt - BlockCypher API
    let data: BlockchainApiResponse | null = await fetchBlockCypherData(address).catch(err => {
      console.error("BlockCypher fetch failed:", err);
      return null;
    });
    
    // Fallback to mempool.space if BlockCypher fails
    if (!data) {
      console.log("BlockCypher falhou, tentando mempool.space...");
      data = await fetchMempoolData(address).catch(err => {
        console.error("mempool.space fetch failed:", err);
        return null;
      });
    }
    
    // Fallback to blockchain.com if both others fail
    if (!data) {
      console.log("Todas as APIs anteriores falharam, tentando blockchain.com...");
      data = await fetchBlockchainInfoData(address).catch(err => {
        console.error("blockchain.info fetch failed:", err);
        return null;
      });
    }

    // If we still don't have data, try one more API
    if (!data) {
      console.log("Tentando blockchair como última alternativa...");
      data = await fetchBlockchairData(address).catch(err => {
        console.error("blockchair fetch failed:", err);
        return null;
      });
    }

    // If we still don't have data, return error
    if (!data) {
      return new Response(
        JSON.stringify({ 
          error: "Não foi possível obter dados da carteira após tentar múltiplas APIs",
          details: "Todas as APIs de blockchain falharam" 
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If we have wallet_id, store data in database
    if (wallet_id && data) {
      await updateWalletData(wallet_id, data);
    }

    console.log("Dados da carteira obtidos com sucesso");
    
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-wallet-data:", error);
    
    return new Response(
      JSON.stringify({ error: "Falha ao processar dados da carteira Bitcoin", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function fetchBlockCypherData(address: string): Promise<BlockchainApiResponse | null> {
  try {
    console.log("Tentando API BlockCypher...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}?limit=5`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
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
      })).slice(0, 10) || []
    };
  } catch (error) {
    console.error("Error fetching from BlockCypher:", error);
    throw error;
  }
}

async function fetchMempoolData(address: string): Promise<BlockchainApiResponse | null> {
  try {
    console.log("Tentando API mempool.space...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://mempool.space/api/address/${address}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`mempool.space API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Fetch transaction data - limite de 10 transações para evitar sobrecarga
    let txs: any[] = [];
    try {
      const txController = new AbortController();
      const txTimeoutId = setTimeout(() => txController.abort(), 5000);
      
      const txResponse = await fetch(`https://mempool.space/api/address/${address}/txs?limit=10`, {
        signal: txController.signal
      });
      
      clearTimeout(txTimeoutId);
      
      if (txResponse.ok) {
        txs = await txResponse.json();
      }
    } catch (txError) {
      console.error("Failed to fetch transactions from mempool.space:", txError);
      // Continue sem transações
    }
    
    // Process and normalize mempool data
    return {
      balance: data.chain_stats.funded_txo_sum / 100000000 - data.chain_stats.spent_txo_sum / 100000000,
      total_received: data.chain_stats.funded_txo_sum / 100000000,
      total_sent: data.chain_stats.spent_txo_sum / 100000000,
      transaction_count: data.chain_stats.tx_count,
      last_updated: new Date().toISOString(),
      transactions: txs.slice(0, 10).map((tx: any) => {
        // Processamento simplificado para as transações
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
    throw error;
  }
}

async function fetchBlockchainInfoData(address: string): Promise<BlockchainApiResponse | null> {
  try {
    console.log("Tentando API blockchain.com...");
    
    // A API blockchain.com requer múltiplas chamadas para os diferentes dados
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const balanceResponse = await fetch(`https://blockchain.info/balance?active=${address}&cors=true`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!balanceResponse.ok) {
      throw new Error(`blockchain.info balance API error: ${balanceResponse.status}`);
    }
    
    const balanceData = await balanceResponse.json();
    const addressData = balanceData[address];
    
    if (!addressData) {
      throw new Error('Address data not found');
    }
    
    // Buscar transações - usando endpoint separado
    let txData = { txs: [], n_tx: 0 };
    try {
      const txController = new AbortController();
      const txTimeoutId = setTimeout(() => txController.abort(), 5000);
      
      const txResponse = await fetch(`https://blockchain.info/rawaddr/${address}?limit=10&cors=true`, {
        signal: txController.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store'
        }
      });
      
      clearTimeout(txTimeoutId);
      
      if (txResponse.ok) {
        txData = await txResponse.json();
      }
    } catch (txError) {
      console.error("Failed to fetch transactions from blockchain.info:", txError);
      // Continuar sem transações
    }
    
    // Process and normalize blockchain.info data
    return {
      balance: addressData.final_balance / 100000000, // Converter satoshis para BTC
      total_received: addressData.total_received / 100000000,
      total_sent: (addressData.total_received - addressData.final_balance) / 100000000,
      transaction_count: txData.n_tx || 0,
      last_updated: new Date().toISOString(),
      transactions: txData.txs?.slice(0, 10).map((tx: any) => {
        // Simplificado - para uma implementação real precisaria de mais lógica
        // para determinar corretamente entrada/saída para cada transação
        return {
          hash: tx.hash,
          amount: tx.result / 100000000,
          transaction_type: tx.result > 0 ? 'entrada' : 'saida',
          transaction_date: new Date(tx.time * 1000).toISOString()
        };
      }) || []
    };
  } catch (error) {
    console.error("Error fetching from blockchain.info:", error);
    throw error;
  }
}

async function fetchBlockchairData(address: string): Promise<BlockchainApiResponse | null> {
  try {
    console.log("Tentando API Blockchair...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://api.blockchair.com/bitcoin/dashboards/address/${address}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Blockchair API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data[address]) {
      throw new Error('No data returned for this address');
    }
    
    const addressData = data.data[address].address;
    const transactions = data.data[address].transactions || [];
    
    // Process and normalize Blockchair data
    return {
      balance: addressData.balance / 100000000,
      total_received: addressData.received / 100000000,
      total_sent: addressData.spent / 100000000,
      transaction_count: addressData.transaction_count,
      last_updated: new Date().toISOString(),
      transactions: transactions.slice(0, 10).map((tx: any) => {
        // Simplificado
        const isPositive = tx.balance_change > 0;
        return {
          hash: tx.hash,
          amount: Math.abs(tx.balance_change) / 100000000,
          transaction_type: isPositive ? 'entrada' : 'saida',
          transaction_date: new Date(tx.time * 1000).toISOString()
        };
      })
    };
  } catch (error) {
    console.error("Error fetching from Blockchair:", error);
    throw error;
  }
}

async function updateWalletData(wallet_id: string, data: BlockchainApiResponse) {
  try {
    console.log(`Atualizando dados no banco para wallet_id: ${wallet_id}`);
    
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
        last_updated: data.last_updated,
        last_successful_update: new Date().toISOString()
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
          .maybeSingle();
        
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
    
    console.log("Dados atualizados com sucesso no banco");
  } catch (error) {
    console.error("Erro ao atualizar dados no banco:", error);
    throw error;
  }
}
