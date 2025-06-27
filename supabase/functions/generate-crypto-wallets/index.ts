
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
          let walletAddress = '';
          let xpubKey = '';
          let privateKeyEncrypted = '';

          if (tatumApiKey) {
            // Use Tatum API to generate real addresses
            const baseUrl = 'https://api.tatum.io/v3';
            const headers = {
              'x-api-key': tatumApiKey,
              'Content-Type': 'application/json'
            };

            let walletResponse;
            let addressResponse;

            // Generate wallet based on currency
            if (mapping.currency === 'BTC') {
              walletResponse = await fetch(`${baseUrl}/bitcoin/wallet`, { method: 'GET', headers });
              const walletData = await walletResponse.json();
              addressResponse = await fetch(`${baseUrl}/bitcoin/address/${walletData.xpub}/0`, { method: 'GET', headers });
              const addressData = await addressResponse.json();
              
              walletAddress = addressData.address;
              xpubKey = walletData.xpub;
              privateKeyEncrypted = btoa(walletData.mnemonic || '');
            } else if (mapping.currency === 'ETH' || mapping.currency === 'USDT') {
              walletResponse = await fetch(`${baseUrl}/ethereum/wallet`, { method: 'GET', headers });
              const walletData = await walletResponse.json();
              addressResponse = await fetch(`${baseUrl}/ethereum/address/${walletData.xpub}/0`, { method: 'GET', headers });
              const addressData = await addressResponse.json();
              
              walletAddress = addressData.address;
              xpubKey = walletData.xpub;
              privateKeyEncrypted = btoa(walletData.mnemonic || '');
            } else if (mapping.currency === 'MATIC') {
              walletResponse = await fetch(`${baseUrl}/polygon/wallet`, { method: 'GET', headers });
              const walletData = await walletResponse.json();
              addressResponse = await fetch(`${baseUrl}/polygon/address/${walletData.xpub}/0`, { method: 'GET', headers });
              const addressData = await addressResponse.json();
              
              walletAddress = addressData.address;
              xpubKey = walletData.xpub;
              privateKeyEncrypted = btoa(walletData.mnemonic || '');
            } else if (mapping.currency === 'SOL') {
              walletResponse = await fetch(`${baseUrl}/solana/wallet`, { method: 'GET', headers });
              const walletData = await walletResponse.json();
              
              walletAddress = walletData.address;
              privateKeyEncrypted = btoa(walletData.privateKey || '');
            }
          } else {
            // Use mock addresses when Tatum API is not available
            walletAddress = `mock_${mapping.currency.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          }

          const walletData = {
            user_id: userId,
            name: mapping.name,
            address: walletAddress,
            currency: mapping.currency,
            balance: 0,
            xpub: xpubKey || null,
            private_key_encrypted: privateKeyEncrypted || null
          };

          // Insert or update wallet
          const { data: wallet, error: walletError } = await supabaseClient
            .from('crypto_wallets')
            .upsert(walletData, { 
              onConflict: 'user_id,currency',
              ignoreDuplicates: false 
            })
            .select()
            .single();

          if (walletError) {
            console.error(`Error creating/updating ${mapping.currency} wallet:`, walletError);
          } else {
            generatedWallets.push(wallet);
            console.log(`Generated ${mapping.currency} wallet with address: ${walletAddress}`);
          }
        } catch (error) {
          console.error(`Error generating ${mapping.currency} wallet:`, error);
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
          message: 'Wallet generation failed',
          error: error.message,
          wallets: generatedWallets,
          count: generatedWallets.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

  } catch (error) {
    console.error('Generate crypto wallets error:', error)
    
    return new Response(
      JSON.stringify({ 
        message: 'Wallet generation failed',
        error: error.message || 'Internal server error',
        wallets: [],
        count: 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
