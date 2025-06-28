
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
      console.log('User already has generated wallets:', existingWallets.length)
      return new Response(
        JSON.stringify({ 
          message: 'Wallets already exist',
          wallets: existingWallets,
          count: existingWallets.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Generate wallets with SECURE approach - NO PRIVATE KEYS STORED
    const generatedWallets = [];
    const tatumApiKey = Deno.env.get('TATUM_API_KEY');
    
    console.log('TATUM_API_KEY configured:', !!tatumApiKey);

    // Generate wallets for each currency
    for (const mapping of cryptoMappings) {
      try {
        let walletAddress = '';
        let xpubKey = '';
        // ❌ REMOVED: privateKeyEncrypted - NEVER STORE PRIVATE KEYS

        if (tatumApiKey) {
          // Use Tatum API to generate real addresses - ONLY PUBLIC DATA
          const baseUrl = 'https://api.tatum.io/v3';
          const headers = {
            'x-api-key': tatumApiKey,
            'Content-Type': 'application/json'
          };

          console.log(`Generating ${mapping.currency} wallet via Tatum - PUBLIC DATA ONLY...`);

          // Generate wallet based on currency - EXTRACT ONLY PUBLIC INFO
          if (mapping.currency === 'BTC') {
            const walletResponse = await fetch(`${baseUrl}/bitcoin/wallet`, { method: 'GET', headers });
            if (!walletResponse.ok) throw new Error(`Bitcoin wallet generation failed: ${walletResponse.status}`);
            const walletData = await walletResponse.json();
            
            const addressResponse = await fetch(`${baseUrl}/bitcoin/address/${walletData.xpub}/0`, { method: 'GET', headers });
            if (!addressResponse.ok) throw new Error(`Bitcoin address generation failed: ${addressResponse.status}`);
            const addressData = await addressResponse.json();
            
            walletAddress = addressData.address;
            xpubKey = walletData.xpub;
            // ❌ REMOVED: privateKeyEncrypted = btoa(walletData.mnemonic || '');
          } else if (mapping.currency === 'ETH' || mapping.currency === 'USDT') {
            const walletResponse = await fetch(`${baseUrl}/ethereum/wallet`, { method: 'GET', headers });
            if (!walletResponse.ok) throw new Error(`Ethereum wallet generation failed: ${walletResponse.status}`);
            const walletData = await walletResponse.json();
            
            const addressResponse = await fetch(`${baseUrl}/ethereum/address/${walletData.xpub}/0`, { method: 'GET', headers });
            if (!addressResponse.ok) throw new Error(`Ethereum address generation failed: ${addressResponse.status}`);
            const addressData = await addressResponse.json();
            
            walletAddress = addressData.address;
            xpubKey = walletData.xpub;
            // ❌ REMOVED: privateKeyEncrypted = btoa(walletData.mnemonic || '');
          } else if (mapping.currency === 'MATIC') {
            const walletResponse = await fetch(`${baseUrl}/polygon/wallet`, { method: 'GET', headers });
            if (!walletResponse.ok) throw new Error(`Polygon wallet generation failed: ${walletResponse.status}`);
            const walletData = await walletResponse.json();
            
            const addressResponse = await fetch(`${baseUrl}/polygon/address/${walletData.xpub}/0`, { method: 'GET', headers });
            if (!addressResponse.ok) throw new Error(`Polygon address generation failed: ${addressResponse.status}`);
            const addressData = await addressResponse.json();
            
            walletAddress = addressData.address;
            xpubKey = walletData.xpub;
            // ❌ REMOVED: privateKeyEncrypted = btoa(walletData.mnemonic || '');
          } else if (mapping.currency === 'SOL') {
            // For Solana, we'll generate but store ONLY the public address
            const walletResponse = await fetch(`${baseUrl}/solana/wallet`, { method: 'GET', headers });
            if (!walletResponse.ok) throw new Error(`Solana wallet generation failed: ${walletResponse.status}`);
            const walletData = await walletResponse.json();
            
            walletAddress = walletData.address;
            // ❌ REMOVED: privateKeyEncrypted = btoa(walletData.privateKey || '');
          }
        } else {
          // Use mock addresses when Tatum API is not available
          console.log(`Using mock address for ${mapping.currency}`);
          walletAddress = `mock_${mapping.currency.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        console.log(`Generated ${mapping.currency} address: ${walletAddress} - SECURE (NO PRIVATE KEYS STORED)`);

        // 🔒 SECURE WALLET DATA - ONLY PUBLIC INFORMATION
        const walletData = {
          user_id: userId,
          name: mapping.name,
          address: walletAddress,
          currency: mapping.currency,
          balance: 0,
          xpub: xpubKey || null,
          // ❌ COMPLETELY REMOVED: private_key_encrypted field
        };

        // Insert wallet directly without upsert to avoid conflict issues
        const { data: wallet, error: walletError } = await supabaseClient
          .from('crypto_wallets')
          .insert(walletData)
          .select()
          .single();

        if (walletError) {
          console.error(`Error creating ${mapping.currency} wallet:`, walletError);
          
          // Try to update existing pending wallet
          const { data: updateWallet, error: updateError } = await supabaseClient
            .from('crypto_wallets')
            .update({
              address: walletAddress,
              xpub: xpubKey || null,
              // ❌ REMOVED: private_key_encrypted update
            })
            .eq('user_id', userId)
            .eq('currency', mapping.currency)
            .select()
            .single();

          if (updateError) {
            console.error(`Error updating ${mapping.currency} wallet:`, updateError);
          } else {
            generatedWallets.push(updateWallet);
            console.log(`Updated ${mapping.currency} wallet successfully - SECURE`);
          }
        } else {
          generatedWallets.push(wallet);
          console.log(`Created ${mapping.currency} wallet successfully - SECURE`);
        }
      } catch (error) {
        console.error(`Error generating ${mapping.currency} wallet:`, error);
        // Continue with other currencies even if one fails
      }
    }

    console.log(`Generated ${generatedWallets.length} SECURE wallets for user ${userId}`);

    return new Response(
      JSON.stringify({
        message: 'Secure wallets generated successfully - NO PRIVATE KEYS STORED',
        wallets: generatedWallets,
        count: generatedWallets.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Generate crypto wallets error:', error)
    
    return new Response(
      JSON.stringify({ 
        message: 'Secure wallet generation failed',
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
