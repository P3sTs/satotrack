
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WalletRequest {
  address: string;
  wallet_id?: string;
  currency: string;
}

interface ProcessedWalletData {
  balance: number;
  total_received: number;
  total_sent: number;
  transaction_count: number;
  unconfirmed_balance?: number;
  transactions?: any[];
}

// API clients for different networks
const fetchBitcoinData = async (address: string): Promise<ProcessedWalletData | null> => {
  try {
    console.log(`🔍 Fetching Bitcoin data for: ${address}`);
    
    // Try multiple Bitcoin APIs for better reliability
    const apis = [
      `https://blockstream.info/api/address/${address}`,
      `https://api.blockcypher.com/v1/btc/main/addrs/${address}`
    ];
    
    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) continue;
        
        const data = await response.json();
        
        if (apiUrl.includes('blockstream')) {
          return {
            balance: (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000,
            total_received: data.chain_stats.funded_txo_sum / 100000000,
            total_sent: data.chain_stats.spent_txo_sum / 100000000,
            transaction_count: data.chain_stats.tx_count,
            unconfirmed_balance: (data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum) / 100000000,
            transactions: []
          };
        } else if (apiUrl.includes('blockcypher')) {
          return {
            balance: (data.balance || 0) / 100000000,
            total_received: (data.total_received || 0) / 100000000,
            total_sent: (data.total_sent || 0) / 100000000,
            transaction_count: data.n_tx || 0,
            unconfirmed_balance: (data.unconfirmed_balance || 0) / 100000000,
            transactions: []
          };
        }
      } catch (error) {
        console.warn(`❌ API ${apiUrl} failed:`, error);
        continue;
      }
    }
    
    throw new Error('All Bitcoin APIs failed');
  } catch (error) {
    console.error('❌ Bitcoin API error:', error);
    return null;
  }
};

const fetchEthereumData = async (address: string): Promise<ProcessedWalletData | null> => {
  try {
    console.log(`🔍 Fetching Ethereum data for: ${address}`);
    
    // Use free Ethereum API
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`);
    
    if (!response.ok) throw new Error(`Ethereum API error: ${response.status}`);
    
    const data = await response.json();
    const balance = parseInt(data.result || '0') / Math.pow(10, 18);
    
    return {
      balance,
      total_received: balance,
      total_sent: 0,
      transaction_count: 0,
      transactions: []
    };
  } catch (error) {
    console.error('❌ Ethereum API error:', error);
    return {
      balance: 0,
      total_received: 0,
      total_sent: 0,
      transaction_count: 0,
      transactions: []
    };
  }
};

const fetchSolanaData = async (address: string): Promise<ProcessedWalletData | null> => {
  try {
    console.log(`🔍 Fetching Solana data for: ${address}`);
    
    const response = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address]
      })
    });
    
    if (!response.ok) throw new Error(`Solana API error: ${response.status}`);
    
    const data = await response.json();
    const balance = (data.result?.value || 0) / Math.pow(10, 9);
    
    return {
      balance,
      total_received: balance,
      total_sent: 0,
      transaction_count: 0,
      transactions: []
    };
  } catch (error) {
    console.error('❌ Solana API error:', error);
    return {
      balance: 0,
      total_received: 0,
      total_sent: 0,
      transaction_count: 0,
      transactions: []
    };
  }
};

const fetchLitecoinData = async (address: string): Promise<ProcessedWalletData | null> => {
  try {
    console.log(`🔍 Fetching Litecoin data for: ${address}`);
    
    const response = await fetch(`https://api.blockcypher.com/v1/ltc/main/addrs/${address}`);
    if (!response.ok) throw new Error(`Litecoin API error: ${response.status}`);
    
    const data = await response.json();
    return {
      balance: (data.balance || 0) / 100000000,
      total_received: (data.total_received || 0) / 100000000,
      total_sent: (data.total_sent || 0) / 100000000,
      transaction_count: data.n_tx || 0,
      transactions: []
    };
  } catch (error) {
    console.error('❌ Litecoin API error:', error);
    return {
      balance: 0,
      total_received: 0,
      total_sent: 0,
      transaction_count: 0,
      transactions: []
    };
  }
};

const fetchDogecoinData = async (address: string): Promise<ProcessedWalletData | null> => {
  try {
    console.log(`🔍 Fetching Dogecoin data for: ${address}`);
    
    const response = await fetch(`https://api.blockcypher.com/v1/doge/main/addrs/${address}`);
    if (!response.ok) throw new Error(`Dogecoin API error: ${response.status}`);
    
    const data = await response.json();
    return {
      balance: (data.balance || 0) / 100000000,
      total_received: (data.total_received || 0) / 100000000,
      total_sent: (data.total_sent || 0) / 100000000,
      transaction_count: data.n_tx || 0,
      transactions: []
    };
  } catch (error) {
    console.error('❌ Dogecoin API error:', error);
    return {
      balance: 0,
      total_received: 0,
      total_sent: 0,
      transaction_count: 0,
      transactions: []
    };
  }
};

const updateWalletDatabase = async (processedData: ProcessedWalletData, walletId: string) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log(`💾 Updating wallet ${walletId} in database`);
  
  // Update wallet data
  const { error: updateError } = await supabase
    .from('crypto_wallets')
    .update({
      balance: processedData.balance,
      total_received: processedData.total_received,
      total_sent: processedData.total_sent,
      transaction_count: processedData.transaction_count,
      last_updated: new Date().toISOString()
    })
    .eq('id', walletId);
  
  if (updateError) {
    console.error('❌ Error updating wallet:', updateError);
    throw updateError;
  }

  console.log('✅ Wallet updated successfully');
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { address, wallet_id, currency }: WalletRequest = await req.json();
    
    if (!address || !currency) {
      return new Response(
        JSON.stringify({ error: 'Address and currency are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🚀 Starting data fetch for address: ${address}, currency: ${currency}`);
    
    let processedData: ProcessedWalletData | null = null;
    
    // Route to appropriate API based on currency
    switch (currency.toLowerCase()) {
      case 'btc':
      case 'bitcoin':
        processedData = await fetchBitcoinData(address);
        break;
      case 'eth':
      case 'ethereum':
        processedData = await fetchEthereumData(address);
        break;
      case 'sol':
      case 'solana':
        processedData = await fetchSolanaData(address);
        break;
      case 'ltc':
      case 'litecoin':
        processedData = await fetchLitecoinData(address);
        break;
      case 'doge':
      case 'dogecoin':
        processedData = await fetchDogecoinData(address);
        break;
      default:
        // Default data for unsupported currencies
        processedData = {
          balance: 0,
          total_received: 0,
          total_sent: 0,
          transaction_count: 0,
          transactions: []
        };
    }

    if (!processedData) {
      // Return default data instead of error
      processedData = {
        balance: 0,
        total_received: 0,
        total_sent: 0,
        transaction_count: 0,
        transactions: []
      };
    }

    console.log(`📊 Final processed data:`, processedData);

    // Update database if wallet_id is provided
    if (wallet_id) {
      await updateWalletDatabase(processedData, wallet_id);
    }

    return new Response(
      JSON.stringify(processedData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error processing request:', error);
    
    // Return default data instead of error to prevent wallet creation failures
    const defaultData = {
      balance: 0,
      total_received: 0,
      total_sent: 0,
      transaction_count: 0,
      transactions: []
    };
    
    return new Response(
      JSON.stringify(defaultData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
