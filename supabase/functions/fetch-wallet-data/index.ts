
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { fetchBlockchainInfo, fetchBlockCypher, fetchBlockstream } from './api-clients.ts';
import { processBlockchainInfoData, processBlockCypherData, processBlockstreamData } from './data-processors.ts';
import { updateWalletDatabase } from './database-operations.ts';
import { ProcessedWalletData } from './types.ts';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    let processedData: ProcessedWalletData;
    
    // Try blockchain.info first (most comprehensive)
    let data = await fetchBlockchainInfo(address);
    if (data) {
      console.log('Using blockchain.info data');
      processedData = processBlockchainInfoData(data, address);
    } else {
      // Try Blockstream as second option
      const blockstreamData = await fetchBlockstream(address);
      if (blockstreamData) {
        console.log('Using Blockstream data');
        processedData = processBlockstreamData(blockstreamData, address);
      } else {
        // Try BlockCypher as last resort
        const blockcypherData = await fetchBlockCypher(address);
        if (!blockcypherData) {
          return new Response(
            JSON.stringify({ error: 'Failed to fetch data from any API' }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        console.log('Using BlockCypher data');
        processedData = processBlockCypherData(blockcypherData, address);
      }
    }

    console.log(`Final processed data:`, processedData);

    // Update database if wallet_id is provided
    if (wallet_id) {
      await updateWalletDatabase(processedData, wallet_id);
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
});
