
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
    const { action, ...params } = await req.json()
    console.log(`🔒 KMS Action: ${action}`, params)

    const tatumApiKey = Deno.env.get('TATUM_API_KEY')
    if (!tatumApiKey) {
      throw new Error('TATUM_API_KEY not configured')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from JWT
    const authHeader = req.headers.get('authorization')!
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Authentication required')
    }

    let result = {}

    switch (action) {
      case 'generate_wallet': {
        const { currency } = params
        console.log(`🔒 Generating KMS wallet for ${currency}`)

        // Generate wallet via Tatum KMS
        const response = await fetch(`https://api.tatum.io/v3/kms/wallet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': tatumApiKey,
          },
          body: JSON.stringify({
            chain: getCurrencyChain(currency),
          }),
        })

        if (!response.ok) {
          throw new Error(`Tatum KMS error: ${response.statusText}`)
        }

        const walletData = await response.json()
        console.log(`🔒 KMS wallet created: ${walletData.address}`)

        result = {
          walletId: walletData.walletId,
          address: walletData.address,
          kmsId: walletData.walletId,
          publicKey: walletData.publicKey,
          currency
        }
        break
      }

      case 'get_balance': {
        const { walletId, currency } = params
        console.log(`🔒 Getting KMS wallet balance: ${walletId}`)

        const chain = getCurrencyChain(currency)
        const response = await fetch(
          `https://api.tatum.io/v3/kms/wallet/${walletId}/balance`,
          {
            headers: { 'x-api-key': tatumApiKey },
          }
        )

        if (!response.ok) {
          throw new Error(`Tatum balance error: ${response.statusText}`)
        }

        const balanceData = await response.json()
        result = { balance: balanceData.balance || '0' }
        break
      }

      case 'sign_transaction': {
        const { walletId, to, amount, currency } = params
        console.log(`🔒 Signing KMS transaction: ${walletId} -> ${to}`)

        const response = await fetch(`https://api.tatum.io/v3/kms/sign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': tatumApiKey,
          },
          body: JSON.stringify({
            walletId,
            to,
            amount,
            chain: getCurrencyChain(currency),
          }),
        })

        if (!response.ok) {
          throw new Error(`Tatum signing error: ${response.statusText}`)
        }

        const signedTx = await response.json()
        result = {
          txId: signedTx.txId,
          rawTransaction: signedTx.rawTransaction,
        }
        break
      }

      case 'get_wallet_info': {
        const { kmsId } = params
        
        const response = await fetch(
          `https://api.tatum.io/v3/kms/wallet/${kmsId}`,
          {
            headers: { 'x-api-key': tatumApiKey },
          }
        )

        if (!response.ok) {
          throw new Error(`Tatum wallet info error: ${response.statusText}`)
        }

        result = await response.json()
        break
      }

      case 'list_wallets': {
        const response = await fetch(`https://api.tatum.io/v3/kms/wallets`, {
          headers: { 'x-api-key': tatumApiKey },
        })

        if (!response.ok) {
          throw new Error(`Tatum list wallets error: ${response.statusText}`)
        }

        const walletsData = await response.json()
        result = { wallets: walletsData }
        break
      }

      case 'health_check': {
        // Simple health check
        result = { status: 'healthy', timestamp: new Date().toISOString() }
        break
      }

      default:
        throw new Error(`Unknown KMS action: ${action}`)
    }

    console.log(`🔒 KMS ${action} completed successfully`)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('🚨 KMS Error:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function getCurrencyChain(currency: string): string {
  const chainMap: Record<string, string> = {
    'BTC': 'BTC',
    'ETH': 'ETH',
    'MATIC': 'MATIC',
    'USDT': 'ETH', // USDT on Ethereum
    'SOL': 'SOL'
  }
  
  return chainMap[currency.toUpperCase()] || 'ETH'
}
