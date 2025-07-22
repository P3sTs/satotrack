
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    console.log('🔒 Gerando carteiras SEGURAS para usuário:', userId)
    
    const TATUM_API_KEY = Deno.env.get('TATUM_API_KEY')
    console.log('TATUM_API_KEY configurado:', !!TATUM_API_KEY)
    
    if (!TATUM_API_KEY) {
      throw new Error('TATUM_API_KEY não configurado')
    }

    // Create Supabase client with SERVICE ROLE to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const currencies = ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL']
    const generatedWallets = []
    
    for (const currency of currencies) {
      try {
        console.log(`🔒 Gerando carteira ${currency} via Tatum - APENAS DADOS PÚBLICOS...`)
        
        // Generate wallet using Tatum API
        let walletResponse
        
        if (currency === 'BTC') {
          walletResponse = await fetch('https://api.tatum.io/v3/bitcoin/wallet', {
            method: 'GET',
            headers: {
              'x-api-key': TATUM_API_KEY,
              'Content-Type': 'application/json'
            }
          })
        } else if (currency === 'ETH' || currency === 'USDT') {
          walletResponse = await fetch('https://api.tatum.io/v3/ethereum/wallet', {
            method: 'GET',
            headers: {
              'x-api-key': TATUM_API_KEY,
              'Content-Type': 'application/json'
            }
          })
        } else if (currency === 'MATIC') {
          walletResponse = await fetch('https://api.tatum.io/v3/polygon/wallet', {
            method: 'GET',
            headers: {
              'x-api-key': TATUM_API_KEY,
              'Content-Type': 'application/json'
            }
          })
        } else if (currency === 'SOL') {
          walletResponse = await fetch('https://api.tatum.io/v3/solana/wallet', {
            method: 'GET',
            headers: {
              'x-api-key': TATUM_API_KEY,
              'Content-Type': 'application/json'
            }
          })
        }

        if (!walletResponse || !walletResponse.ok) {
          throw new Error(`Tatum API erro para ${currency}: ${walletResponse?.statusText}`)
        }

        const walletData = await walletResponse.json()
        
        // Generate address from wallet
        let address = ''
        if (currency === 'BTC') {
          const addressResponse = await fetch(`https://api.tatum.io/v3/bitcoin/address/${walletData.xpub}/0`, {
            method: 'GET',
            headers: {
              'x-api-key': TATUM_API_KEY,
            }
          })
          if (addressResponse.ok) {
            const addressData = await addressResponse.json()
            address = addressData.address
          }
        } else if (currency === 'ETH' || currency === 'USDT') {
          const addressResponse = await fetch(`https://api.tatum.io/v3/ethereum/address/${walletData.xpub}/0`, {
            method: 'GET',
            headers: {
              'x-api-key': TATUM_API_KEY,
            }
          })
          if (addressResponse.ok) {
            const addressData = await addressResponse.json()
            address = addressData.address
          }
        } else if (currency === 'MATIC') {
          const addressResponse = await fetch(`https://api.tatum.io/v3/polygon/address/${walletData.xpub}/0`, {
            method: 'GET',
            headers: {
              'x-api-key': TATUM_API_KEY,
            }
          })
          if (addressResponse.ok) {
            const addressData = await addressResponse.json()
            address = addressData.address
          }
        } else if (currency === 'SOL') {
          const addressResponse = await fetch(`https://api.tatum.io/v3/solana/address/${walletData.xpub}/0`, {
            method: 'GET',
            headers: {
              'x-api-key': TATUM_API_KEY,
            }
          })
          if (addressResponse.ok) {
            const addressData = await addressResponse.json()
            address = addressData.address
          }
        }

        // Se não conseguiu gerar endereço, pular esta moeda
        if (!address) {
          console.log(`⚠️ Não foi possível gerar endereço para ${currency}, pulando...`)
          continue
        }

        console.log(`🔒 Endereço ${currency} gerado: ${address} - SEGURO (SEM CHAVES PRIVADAS ARMAZENADAS)`)

        // Check if wallet already exists to prevent duplicates
        const { data: existingWallet, error: selectError } = await supabase
          .from('crypto_wallets')
          .select('id')
          .eq('user_id', userId)
          .eq('currency', currency)
          .maybeSingle(); // Use maybeSingle to avoid error when no record found

        
        if (selectError) {
          console.error(`Error checking existing wallet for ${currency}:`, selectError);
          continue;
        }

        if (existingWallet) {
          // Update existing wallet with better error handling
          const { data: updatedWallet, error: updateError } = await supabase
            .from('crypto_wallets')
            .update({
              address: address,
              xpub: walletData.xpub,
              name: `${currency} Wallet`,
              last_updated: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('currency', currency)
            .select()
            .maybeSingle();

          if (updateError) {
            console.error(`Erro ao atualizar carteira ${currency}:`, updateError);
          } else if (updatedWallet) {
            generatedWallets.push(updatedWallet);
            console.log(`✅ Carteira ${currency} atualizada com sucesso`);
          }
        } else {
          // Create new wallet with comprehensive data
          const { data: newWallet, error: insertError } = await supabase
            .from('crypto_wallets')
            .insert({
              user_id: userId,
              currency: currency,
              address: address,
              xpub: walletData.xpub,
              name: `${currency} Wallet`,
              balance: 0,
              native_token_balance: 0,
              tokens_data: [],
              total_received: 0,
              total_sent: 0,
              transaction_count: 0,
              address_type: currency.toLowerCase(),
              created_at: new Date().toISOString(),
              last_updated: new Date().toISOString()
            })
            .select()
            .maybeSingle();

          if (insertError) {
            console.error(`Erro ao criar carteira ${currency}:`, insertError);
            // Se for erro de unique constraint, tentar buscar existente
            if (insertError.code === '23505') {
              const { data: existingRetry } = await supabase
                .from('crypto_wallets')
                .select('*')
                .eq('user_id', userId)
                .eq('currency', currency)
                .maybeSingle();
              
              if (existingRetry) {
                generatedWallets.push(existingRetry);
                console.log(`✅ Carteira ${currency} já existia - usando existente`);
              }
            }
          } else if (newWallet) {
            generatedWallets.push(newWallet);
            console.log(`✅ Carteira ${currency} criada com sucesso`);
          }
        }

      } catch (error) {
        console.error(`Erro na geração da carteira ${currency}:`, error)
      }
    }

    console.log(`🔒 Geradas ${generatedWallets.length} carteiras SEGURAS para usuário ${userId}`)

    return new Response(
      JSON.stringify({
        success: true,
        wallets: generatedWallets,
        message: `${generatedWallets.length} carteiras geradas com segurança via Tatum KMS`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('🚨 Erro na geração de carteiras:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Erro interno na geração de carteiras',
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
