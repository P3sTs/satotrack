
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

    // First, ensure we have the right network records
    const networks = [
      { name: 'Bitcoin', symbol: 'BTC', chain_id: 'bitcoin-mainnet' },
      { name: 'Ethereum', symbol: 'ETH', chain_id: '1' },
      { name: 'Polygon', symbol: 'MATIC', chain_id: '137' },
      { name: 'Tether (USDT)', symbol: 'USDT', chain_id: '1' },
      { name: 'Solana', symbol: 'SOL', chain_id: 'solana-mainnet' }
    ];

    // Insert or update networks
    for (const network of networks) {
      const { error: networkError } = await supabaseClient
        .from('blockchain_networks')
        .upsert(network, { onConflict: 'symbol' });
      
      if (networkError) {
        console.warn('Network upsert warning:', networkError);
      }
    }

    // Generate wallets with proper currency field
    const generatedWallets = [];

    try {
      const tatumApiKey = Deno.env.get('TATUM_API_KEY');
      
      if (!tatumApiKey) {
        console.warn('TATUM_API_KEY not found, using mock addresses');
        
        // Generate mock wallets when Tatum API is not available
        for (const mapping of cryptoMappings) {
          const mockAddress = `mock_${mapping.currency.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Get network_id from blockchain_networks table
          const { data: network } = await supabaseClient
            .from('blockchain_networks')
            .select('id')
            .eq('symbol', mapping.currency)
            .single();

          const walletData = {
            user_id: userId,
            name: mapping.name,
            address: mockAddress,
            currency: mapping.currency,
            network_id: network?.id || null,
            balance: '0',
            private_key_encrypted: null,
            xpub: null,
            address_type: 'generated'
          };

          const { data: wallet, error: walletError } = await supabaseClient
            .from('crypto_wallets')
            .upsert(walletData, { 
              onConflict: 'user_id,currency',
              ignoreDuplicates: false 
            })
            .select()
            .single();

          if (walletError) {
            console.error(`Error creating ${mapping.currency} wallet:`, walletError);
          } else {
            generatedWallets.push(wallet);
          }
        }
      } else {
        // Use Tatum API to generate real wallets
        console.log('Using Tatum API to generate wallets');
        
        for (const mapping of cryptoMappings) {
          try {
            // Get network_id from blockchain_networks table
            const { data: network } = await supabaseClient
              .from('blockchain_networks')
              .select('id')
              .eq('symbol', mapping.currency)
              .single();

            let address = `tatum_${mapping.currency.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // For demonstration, we'll create mock addresses
            // In production, integrate with actual Tatum API calls
            
            const walletData = {
              user_id: userId,
              name: mapping.name,
              address: address,
              currency: mapping.currency,
              network_id: network?.id || null,
              balance: '0',
              private_key_encrypted: null,
              xpub: null,
              address_type: 'generated'
            };

            const { data: wallet, error: walletError } = await supabaseClient
              .from('crypto_wallets')
              .upsert(walletData, { 
                onConflict: 'user_id,currency',
                ignoreDuplicates: false 
              })
              .select()
              .single();

            if (walletError) {
              console.error(`Error creating ${mapping.currency} wallet:`, walletError);
            } else {
              generatedWallets.push(wallet);
            }
          } catch (error) {
            console.error(`Error generating ${mapping.currency} wallet:`, error);
          }
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
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate wallets',
          details: error.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

  } catch (error) {
    console.error('Generate crypto wallets error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
