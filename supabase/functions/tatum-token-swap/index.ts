import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface SwapQuoteRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  fromAddress: string;
  toAddress: string;
  feeType?: 'fixed' | 'percentage';
}

interface SwapExecuteRequest extends SwapQuoteRequest {
  privateKey: string;
}

// Helper function to get platform settings
async function getPlatformSettings(key: string) {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('setting_value')
    .eq('setting_key', key)
    .single();
  
  if (error) {
    console.error('Error fetching platform settings:', error);
    return null;
  }
  
  return data?.setting_value;
}

// Helper function to calculate platform fee
function calculatePlatformFee(amount: number, fromCurrency: string, feeType: string, settings: any) {
  if (feeType === 'fixed') {
    const fixedFees = settings.fixed;
    return {
      amount: parseFloat(fixedFees[fromCurrency] || '0.001'),
      currency: fromCurrency,
      type: 'fixed'
    };
  } else {
    // Percentage fee
    const percentageRate = parseFloat(settings.percentage.rate) / 100;
    const feeAmount = amount * percentageRate;
    const minFeeUsd = parseFloat(settings.percentage.min_fee_usd);
    
    return {
      amount: Math.max(feeAmount, minFeeUsd / 100), // Simplified USD conversion
      currency: fromCurrency,
      type: 'percentage'
    };
  }
}

// Helper function to record swap transaction
async function recordSwapTransaction(
  userId: string,
  swapData: any,
  platformFee: any,
  status: string = 'pending'
) {
  const { data, error } = await supabase
    .from('swap_transactions')
    .insert({
      user_id: userId,
      from_currency: swapData.fromCurrency,
      to_currency: swapData.toCurrency,
      from_amount: swapData.fromAmount,
      to_amount: swapData.toAmount,
      from_address: swapData.fromAddress,
      to_address: swapData.toAddress,
      transaction_hash: swapData.transactionHash,
      status,
      swap_rate: swapData.rate,
      network_fee: swapData.estimatedFee,
      platform_fee_amount: platformFee.amount,
      platform_fee_type: platformFee.type,
      platform_fee_currency: platformFee.currency
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error recording swap transaction:', error);
  }
  
  return { data, error };
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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    let userId = null;
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    const { action, ...requestData } = await req.json();
    console.log('Tatum swap request:', { action, requestData, userId });

    const tatumHeaders = {
      'Content-Type': 'application/json',
      'x-api-key': tatumApiKey,
    };

    switch (action) {
      case 'quote': {
        const { fromCurrency, toCurrency, amount, feeType = 'percentage' } = requestData as SwapQuoteRequest;
        
        // Get platform settings for fees
        const feeSettings = await getPlatformSettings('swap_fees');
        if (!feeSettings) {
          throw new Error('Platform fee settings not configured');
        }

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

        // Calculate platform fee
        const platformFee = calculatePlatformFee(parseFloat(amount), fromCurrency, feeType, feeSettings);

        // Estimate network fees based on currency
        let estimatedFee = '0.001 ETH'; // Default
        if (fromCurrency === 'BTC') {
          estimatedFee = '0.0001 BTC';
        } else if (fromCurrency === 'MATIC') {
          estimatedFee = '0.01 MATIC';
        } else if (fromCurrency === 'USDT') {
          estimatedFee = '2 USDT';
        }

        // Calculate final amount after platform fee
        const finalToAmount = toAmount; // Platform fee is taken from source, not destination
        const totalFromAmount = parseFloat(amount) + platformFee.amount;

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              rate,
              fromAmount: amount,
              toAmount: finalToAmount.toFixed(8),
              estimatedFee,
              platformFee: {
                amount: platformFee.amount,
                currency: platformFee.currency,
                type: platformFee.type
              },
              totalFromAmount: totalFromAmount.toFixed(8),
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
        const { fromCurrency, toCurrency, amount, fromAddress, toAddress, privateKey, feeType = 'percentage' } = requestData as SwapExecuteRequest;
        
        if (!userId) {
          throw new Error('Authentication required');
        }

        // Get platform settings for fees
        const feeSettings = await getPlatformSettings('swap_fees');
        if (!feeSettings) {
          throw new Error('Platform fee settings not configured');
        }

        // Get exchange rate again for execution
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

        // Calculate platform fee
        const platformFee = calculatePlatformFee(parseFloat(amount), fromCurrency, feeType, feeSettings);

        // For demonstration, we'll simulate the swap execution
        // In a real implementation, you would use Tatum's DEX or exchange APIs
        console.log('Executing swap:', { fromCurrency, toCurrency, amount, fromAddress, toAddress });
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a mock transaction hash
        const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

        // Calculate estimated fees
        let estimatedFee = '0.001 ETH';
        if (fromCurrency === 'BTC') {
          estimatedFee = '0.0001 BTC';
        } else if (fromCurrency === 'MATIC') {
          estimatedFee = '0.01 MATIC';
        } else if (fromCurrency === 'USDT') {
          estimatedFee = '2 USDT';
        }

        // Record swap transaction in database
        const swapData = {
          fromCurrency,
          toCurrency,
          fromAmount: amount,
          toAmount: toAmount.toFixed(8),
          fromAddress,
          toAddress,
          transactionHash: txHash,
          rate,
          estimatedFee
        };

        const { data: dbRecord, error: dbError } = await recordSwapTransaction(
          userId,
          swapData,
          platformFee,
          'pending'
        );

        if (dbError) {
          console.error('Failed to record swap transaction:', dbError);
        }

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
              platformFee: {
                amount: platformFee.amount,
                currency: platformFee.currency,
                type: platformFee.type
              },
              swapId: dbRecord?.id,
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