
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Bitcoin data fetching
async function fetchBitcoinData(address: string) {
  try {
    const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=10`);
    if (!response.ok) throw new Error(`Bitcoin API error: ${response.status}`);
    
    const data = await response.json();
    
    return {
      nativeBalance: data.final_balance / 100000000, // Convert satoshis to BTC
      tokens: [], // Bitcoin doesn't have tokens
      totalUsdValue: 0, // Will be calculated with price data
      transactionCount: data.n_tx
    };
  } catch (error) {
    console.error('Bitcoin API error:', error);
    throw error;
  }
}

// Ethereum/EVM chains data fetching
async function fetchEthereumData(address: string, network: string) {
  try {
    let apiUrl = '';
    let nativeSymbol = '';
    
    switch (network) {
      case 'ethereum':
        apiUrl = 'https://api.etherscan.io/api';
        nativeSymbol = 'ETH';
        break;
      case 'bsc':
        apiUrl = 'https://api.bscscan.com/api';
        nativeSymbol = 'BNB';
        break;
      case 'polygon':
        apiUrl = 'https://api.polygonscan.com/api';
        nativeSymbol = 'MATIC';
        break;
      case 'arbitrum':
        apiUrl = 'https://api.arbiscan.io/api';
        nativeSymbol = 'ETH';
        break;
      case 'optimism':
        apiUrl = 'https://api-optimistic.etherscan.io/api';
        nativeSymbol = 'ETH';
        break;
      default:
        throw new Error(`Unsupported EVM network: ${network}`);
    }

    // Get native balance
    const balanceResponse = await fetch(
      `${apiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`
    );
    const balanceData = await balanceResponse.json();
    
    if (balanceData.status !== '1') {
      throw new Error(`Failed to fetch balance: ${balanceData.message}`);
    }

    const nativeBalance = parseInt(balanceData.result) / Math.pow(10, 18); // Convert Wei to Ether

    // Get transaction count
    const txCountResponse = await fetch(
      `${apiUrl}?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=YourApiKeyToken`
    );
    const txCountData = await txCountResponse.json();
    const transactionCount = parseInt(txCountData.result, 16);

    // Get ERC-20 token balances (simplified - top 20 tokens)
    let tokens = [];
    try {
      const tokenResponse = await fetch(
        `${apiUrl}?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken`
      );
      const tokenData = await tokenResponse.json();
      
      if (tokenData.status === '1' && tokenData.result) {
        // Process unique tokens from transactions
        const uniqueTokens = new Map();
        tokenData.result.forEach((tx: any) => {
          if (!uniqueTokens.has(tx.contractAddress)) {
            uniqueTokens.set(tx.contractAddress, {
              address: tx.contractAddress,
              symbol: tx.tokenSymbol,
              name: tx.tokenName,
              decimals: parseInt(tx.tokenDecimal),
              balance: 0,
              usdValue: 0
            });
          }
        });
        
        tokens = Array.from(uniqueTokens.values()).slice(0, 10); // Limit to 10 tokens
      }
    } catch (tokenError) {
      console.error('Error fetching tokens:', tokenError);
    }

    return {
      nativeBalance,
      tokens,
      totalUsdValue: 0, // Will be calculated with price data
      transactionCount
    };
  } catch (error) {
    console.error('Ethereum API error:', error);
    throw error;
  }
}

// Solana data fetching
async function fetchSolanaData(address: string) {
  try {
    const rpcUrl = 'https://api.mainnet-beta.solana.com';
    
    // Get SOL balance
    const balanceResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address]
      })
    });
    
    const balanceData = await balanceResponse.json();
    const nativeBalance = balanceData.result.value / Math.pow(10, 9); // Convert lamports to SOL

    // Get token accounts
    const tokenResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          address,
          { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
          { encoding: 'jsonParsed' }
        ]
      })
    });
    
    const tokenData = await tokenResponse.json();
    let tokens = [];
    
    if (tokenData.result && tokenData.result.value) {
      tokens = tokenData.result.value.map((account: any) => {
        const info = account.account.data.parsed.info;
        return {
          address: info.mint,
          symbol: 'SPL', // Would need token metadata for actual symbol
          name: 'SPL Token',
          balance: parseInt(info.tokenAmount.amount) / Math.pow(10, info.tokenAmount.decimals),
          decimals: info.tokenAmount.decimals,
          usdValue: 0
        };
      }).filter((token: any) => token.balance > 0).slice(0, 10);
    }

    return {
      nativeBalance,
      tokens,
      totalUsdValue: 0,
      transactionCount: 0 // Solana doesn't have a simple transaction count API
    };
  } catch (error) {
    console.error('Solana API error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { address, network, chainId } = await req.json();
    
    if (!address || !network) {
      return new Response(
        JSON.stringify({ error: 'Address and network are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let data;
    
    switch (network) {
      case 'bitcoin':
        data = await fetchBitcoinData(address);
        break;
      case 'ethereum':
      case 'bsc':
      case 'polygon':
      case 'arbitrum':
      case 'optimism':
        data = await fetchEthereumData(address, network);
        break;
      case 'solana':
        data = await fetchSolanaData(address);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unsupported network: ${network}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
