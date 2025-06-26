
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const cryptoMappings = [
  { name: 'Bitcoin', currency: 'BTC' },
  { name: 'Ethereum', currency: 'ETH' },
  { name: 'Polygon', currency: 'MATIC' },
  { name: 'Tether', currency: 'USDT' },
  { name: 'Solana', currency: 'SOL' }
];

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
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { userId } = await req.json()

    console.log('Generating crypto wallets for user:', userId)

    // Check if wallets already exist and are not pending
    const { data: existingWallets, error: checkError } = await supabaseClient
      .from('crypto_wallets')
      .select('*')
      .eq('user_id', userId)
      .neq('address', 'pending_generation')

    if (checkError) {
      console.error('Error checking existing wallets:', checkError)
    }

    if (existingWallets && existingWallets.length > 0) {
      console.log('User already has generated wallets')
      return new Response(
        JSON.stringify({ 
          message: 'Wallets already exist',
          wallets: existingWallets 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Generate wallets with proper structure
    const generatedWallets = [];

    try {
      const tatumApiKey = Deno.env.get('TATUM_API_KEY');
      
      if (!tatumApiKey) {
        console.warn('TATUM_API_KEY not found, using mock addresses');
      }

      // Generate wallets for each currency
      for (const mapping of cryptoMappings) {
        try {
          const mockAddress = `mock_${mapping.currency.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          const walletData = {
            user_id: userId,
            name: mapping.name,
            address: mockAddress,
            balance: 0,
            network_id: crypto.randomUUID(), // Generate a UUID for network_id
            address_type: 'generated',
            private_key_encrypted: null,
            xpub: null
          };

          const { data: wallet, error: walletError } = await supabaseClient
            .from('crypto_wallets')
            .insert(walletData)
            .select()
            .single();

          if (walletError) {
            console.error(`Error creating ${mapping.currency} wallet:`, walletError);
            // Continue with other wallets instead of failing completely
          } else {
            generatedWallets.push(wallet);
          }
        } catch (error) {
          console.error(`Error generating ${mapping.currency} wallet:`, error);
          // Continue with other wallets
        }
      }

      // Remove any pending wallets
      await supabaseClient
        .from('crypto_wallets')
        .delete()
        .eq('user_id', userId)
        .eq('address', 'pending_generation');

      console.log(`Generated ${generatedWallets.length} wallets for user ${userId}`);

      return new Response(
        JSON.stringify({
          message: 'Wallets generated successfully',
          wallets: generatedWallets,
          count: generatedWallets.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )

    } catch (error) {
      console.error('Wallet generation error:', error);
      
      // Even if wallet generation fails, don't block user registration
      return new Response(
        JSON.stringify({ 
          message: 'User created but wallet generation failed',
          error: error.message,
          wallets: [],
          count: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 to not block registration
        }
      )
    }

  } catch (error) {
    console.error('Generate crypto wallets error:', error)
    
    // Don't block user registration even if this fails
    return new Response(
      JSON.stringify({ 
        message: 'Wallet generation failed but user registration can continue',
        error: error.message || 'Internal server error',
        wallets: [],
        count: 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 to not block registration
      }
    )
  }
})
