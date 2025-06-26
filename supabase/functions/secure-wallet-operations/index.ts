
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validateAmount = (amount: string, currency: string): { isValid: boolean; error?: string } => {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return { isValid: false, error: 'Invalid amount' };
  }
  
  const minimums: Record<string, number> = {
    'BTC': 0.00001,
    'ETH': 0.001,
    'MATIC': 0.01,
    'USDT': 1,
    'SOL': 0.001
  };
  
  const minAmount = minimums[currency.toUpperCase()] || 0.0001;
  
  if (numAmount < minAmount) {
    return { isValid: false, error: `Minimum amount for ${currency} is ${minAmount}` };
  }
  
  if (numAmount > 1000000) {
    return { isValid: false, error: 'Amount too high' };
  }
  
  return { isValid: true };
};

const validateAddress = (address: string): boolean => {
  if (!address || address.length < 10 || address.length > 100) {
    return false;
  }
  
  const addressRegex = /^[a-zA-Z0-9]+$/;
  return addressRegex.test(address);
};

// Rate limiting
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (userId: string, maxRequests = 10, windowMs = 60000): boolean => {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId);
  
  if (!userRequests || now > userRequests.resetTime) {
    rateLimiter.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userRequests.count >= maxRequests) {
    return false;
  }
  
  userRequests.count++;
  return true;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Verify authentication
    const authHeader = req.headers.get('Authorization')!
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: user, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user.user) {
      throw new Error('Unauthorized')
    }

    // Rate limiting
    if (!checkRateLimit(user.user.id)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 
        }
      )
    }

    const { operation, ...payload } = await req.json()

    // Log security event
    await supabaseClient
      .from('security_logs')
      .insert({
        user_id: user.user.id,
        event_type: 'wallet_operation',
        details: {
          operation,
          timestamp: new Date().toISOString(),
          ip: req.headers.get('x-forwarded-for') || 'unknown'
        }
      });

    let result = {};

    switch (operation) {
      case 'validate_transaction':
        const { recipient, amount, currency } = payload;
        
        // Input validation
        if (!validateAddress(recipient)) {
          throw new Error('Invalid recipient address');
        }
        
        const amountValidation = validateAmount(amount, currency);
        if (!amountValidation.isValid) {
          throw new Error(amountValidation.error || 'Invalid amount');
        }
        
        result = { valid: true, message: 'Transaction validated' };
        break;

      case 'check_wallet_security':
        const { data: wallets, error: walletsError } = await supabaseClient
          .from('crypto_wallets')
          .select('id, private_key_encrypted')
          .eq('user_id', user.user.id);

        if (walletsError) throw walletsError;

        const insecureWallets = wallets?.filter(wallet => {
          if (!wallet.private_key_encrypted) return false;
          
          try {
            const decoded = atob(wallet.private_key_encrypted);
            return /^[a-fA-F0-9]{64}$/.test(decoded);
          } catch {
            return false;
          }
        }) || [];

        result = {
          total_wallets: wallets?.length || 0,
          insecure_wallets: insecureWallets.length,
          security_status: insecureWallets.length === 0 ? 'secure' : 'needs_attention'
        };
        break;

      default:
        throw new Error('Unknown operation');
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Secure wallet operations error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 
                error.message === 'Rate limit exceeded' ? 429 : 500
      }
    )
  }
})
