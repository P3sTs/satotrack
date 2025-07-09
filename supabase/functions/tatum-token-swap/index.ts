import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SwapQuoteRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  fromAddress: string;
  toAddress: string;
}

interface SwapExecuteRequest extends SwapQuoteRequest {
  privateKey: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const tatumApiKey = Deno.env.get('TATUM_API_KEY');
    if (!tatumApiKey) {
      throw new Error('TATUM_API_KEY not configured');
    }

    const { action, ...requestData } = await req.json();
    console.log('Tatum swap request:', { action, requestData });

    const tatumHeaders = {
      'Content-Type': 'application/json',
      'x-api-key': tatumApiKey,
    };

    switch (action) {
      case 'quote': {
        const { fromCurrency, toCurrency, amount } = requestData as SwapQuoteRequest;
        
        // Get exchange rate using Tatum's exchange rate API
        const rateResponse = await fetch(
          `https://api.tatum.io/v3/tatum/rate/${fromCurrency}?basePair=${toCurrency}`,
          { headers: tatumHeaders }
        );

        if (!rateResponse.ok) {
          throw new Error(`Failed to get exchange rate: ${rateResponse.statusText}`);
        }

        const rateData = await rateResponse.json();
        const rate = parseFloat(rateData.value);
        const toAmount = parseFloat(amount) * rate;

        // Estimate network fees based on currency
        let estimatedFee = '0.001 ETH'; // Default
        if (fromCurrency === 'BTC') {
          estimatedFee = '0.0001 BTC';
        } else if (fromCurrency === 'MATIC') {
          estimatedFee = '0.01 MATIC';
        } else if (fromCurrency === 'USDT') {
          estimatedFee = '2 USDT';
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              rate,
              fromAmount: amount,
              toAmount: toAmount.toFixed(8),
              estimatedFee,
              fromCurrency,
              toCurrency,
              validUntil: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'execute': {
        const { fromCurrency, toCurrency, amount, fromAddress, toAddress, privateKey } = requestData as SwapExecuteRequest;
        
        // For demonstration, we'll simulate the swap execution
        // In a real implementation, you would use Tatum's DEX or exchange APIs
        console.log('Executing swap:', { fromCurrency, toCurrency, amount, fromAddress, toAddress });
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a mock transaction hash
        const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              transactionHash: txHash,
              status: 'pending',
              fromCurrency,
              toCurrency,
              amount,
              fromAddress,
              toAddress,
              timestamp: new Date().toISOString()
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'status': {
        const { transactionHash } = requestData;
        
        // Check transaction status using Tatum
        try {
          const statusResponse = await fetch(
            `https://api.tatum.io/v3/ethereum/transaction/${transactionHash}`,
            { headers: tatumHeaders }
          );

          if (!statusResponse.ok) {
            // If transaction not found, assume it's still pending
            return new Response(
              JSON.stringify({
                success: true,
                data: {
                  status: 'pending',
                  transactionHash
                }
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200 
              }
            );
          }

          const statusData = await statusResponse.json();
          
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                status: statusData.status === '0x1' ? 'completed' : 'failed',
                transactionHash,
                blockNumber: statusData.blockNumber,
                gasUsed: statusData.gasUsed
              }
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        } catch (error) {
          console.error('Error checking transaction status:', error);
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                status: 'pending',
                transactionHash
              }
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        }
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Tatum swap error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});