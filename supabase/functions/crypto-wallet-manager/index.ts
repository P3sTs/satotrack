
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WalletRequest {
  action: 'generate_wallets' | 'get_balance' | 'send_transaction' | 'get_transactions'
  currency?: string
  recipient?: string
  amount?: string
  privateKey?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const TATUM_API_KEY = Deno.env.get('TATUM_API_KEY')
    if (!TATUM_API_KEY) {
      throw new Error('TATUM_API_KEY not configured')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabaseClient.auth.getUser(token)

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    const { action, currency, recipient, amount, privateKey }: WalletRequest = await req.json()

    const baseUrl = 'https://api.tatum.io/v3'
    const headers = {
      'x-api-key': TATUM_API_KEY,
      'Content-Type': 'application/json'
    }

    let result: any = {}

    switch (action) {
      case 'generate_wallets': {
        console.log(`Generating wallets for user: ${user.user.id}`)
        
        const currencies = [
          { name: 'Bitcoin', network_id: 'BTC' },
          { name: 'Ethereum', network_id: 'ETH' },
          { name: 'Polygon', network_id: 'MATIC' },
          { name: 'Tether', network_id: 'USDT' },
          { name: 'Solana', network_id: 'SOL' }
        ]
        const generatedWallets = []

        for (const curr of currencies) {
          try {
            // Check if wallet already exists
            const { data: existingWallet } = await supabaseClient
              .from('crypto_wallets')
              .select('*')
              .eq('user_id', user.user.id)
              .eq('name', curr.name)
              .single()

            if (existingWallet && existingWallet.address !== 'pending_generation') {
              console.log(`Wallet for ${curr.name} already exists`)
              generatedWallets.push(existingWallet)
              continue
            }

            // Generate new wallet based on currency
            let walletResponse
            let addressResponse
            
            if (curr.network_id === 'BTC') {
              walletResponse = await fetch(`${baseUrl}/bitcoin/wallet`, {
                method: 'GET',
                headers
              })
            } else if (curr.network_id === 'ETH' || curr.network_id === 'USDT') {
              walletResponse = await fetch(`${baseUrl}/ethereum/wallet`, {
                method: 'GET',
                headers
              })
            } else if (curr.network_id === 'MATIC') {
              walletResponse = await fetch(`${baseUrl}/polygon/wallet`, {
                method: 'GET',
                headers
              })
            } else if (curr.network_id === 'SOL') {
              walletResponse = await fetch(`${baseUrl}/solana/wallet`, {
                method: 'GET',
                headers
              })
            }

            if (!walletResponse?.ok) {
              console.error(`Failed to generate ${curr.name} wallet`)
              continue
            }

            const walletData = await walletResponse.json()
            
            // Generate address from wallet
            if (curr.network_id === 'BTC') {
              addressResponse = await fetch(`${baseUrl}/bitcoin/address/${walletData.xpub}/0`, {
                method: 'GET',
                headers
              })
            } else if (curr.network_id === 'ETH' || curr.network_id === 'USDT') {
              addressResponse = await fetch(`${baseUrl}/ethereum/address/${walletData.xpub}/0`, {
                method: 'GET',
                headers
              })
            } else if (curr.network_id === 'MATIC') {
              addressResponse = await fetch(`${baseUrl}/polygon/address/${walletData.xpub}/0`, {
                method: 'GET',
                headers
              })
            } else if (curr.network_id === 'SOL') {
              // Solana uses different structure
              addressResponse = { ok: true, json: async () => ({ address: walletData.address }) }
            }

            const addressData = await addressResponse?.json()

            // Update wallet in database
            const { data: updatedWallet, error } = await supabaseClient
              .from('crypto_wallets')
              .update({
                address: addressData?.address || walletData.address,
                xpub: walletData.xpub,
                private_key_encrypted: btoa(walletData.privateKey) // Simple encoding for demo
              })
              .eq('user_id', user.user.id)
              .eq('name', curr.name)
              .select()
              .single()

            if (error) {
              console.error(`Error updating ${curr.name} wallet:`, error)
            } else {
              console.log(`${curr.name} wallet generated successfully`)
              generatedWallets.push(updatedWallet)
            }

          } catch (error) {
            console.error(`Error generating ${curr.name} wallet:`, error)
          }
        }

        result = { generatedWallets }
        break
      }

      case 'get_balance': {
        if (!currency) throw new Error('Currency required')
        
        const { data: wallet } = await supabaseClient
          .from('crypto_wallets')
          .select('*')
          .eq('user_id', user.user.id)
          .eq('network_id', currency)
          .single()

        if (!wallet || wallet.address === 'pending_generation') {
          throw new Error('Wallet not found or not generated')
        }

        let balanceResponse
        
        if (currency === 'BTC') {
          balanceResponse = await fetch(`${baseUrl}/bitcoin/address/balance/${wallet.address}`, {
            method: 'GET',
            headers
          })
        } else if (currency === 'ETH') {
          balanceResponse = await fetch(`${baseUrl}/ethereum/account/balance/${wallet.address}`, {
            method: 'GET',
            headers
          })
        } else if (currency === 'MATIC') {
          balanceResponse = await fetch(`${baseUrl}/polygon/account/balance/${wallet.address}`, {
            method: 'GET',
            headers
          })
        } else if (currency === 'USDT') {
          // USDT ERC20 token balance
          balanceResponse = await fetch(`${baseUrl}/ethereum/account/balance/erc20/${wallet.address}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7' // USDT contract
            })
          })
        } else if (currency === 'SOL') {
          balanceResponse = await fetch(`${baseUrl}/solana/account/balance/${wallet.address}`, {
            method: 'GET',
            headers
          })
        }

        const balanceData = await balanceResponse?.json()
        
        result = {
          address: wallet.address,
          balance: balanceData?.incoming || balanceData?.balance || '0',
          currency
        }
        break
      }

      case 'get_transactions': {
        if (!currency) throw new Error('Currency required')
        
        const { data: wallet } = await supabaseClient
          .from('crypto_wallets')
          .select('*')
          .eq('user_id', user.user.id)
          .eq('network_id', currency)
          .single()

        if (!wallet) throw new Error('Wallet not found')

        let txResponse
        
        if (currency === 'BTC') {
          txResponse = await fetch(`${baseUrl}/bitcoin/transaction/address/${wallet.address}?pageSize=50`, {
            method: 'GET',
            headers
          })
        } else if (currency === 'ETH' || currency === 'USDT') {
          txResponse = await fetch(`${baseUrl}/ethereum/account/transaction/${wallet.address}?pageSize=50`, {
            method: 'GET',
            headers
          })
        } else if (currency === 'MATIC') {
          txResponse = await fetch(`${baseUrl}/polygon/account/transaction/${wallet.address}?pageSize=50`, {
            method: 'GET',
            headers
          })
        } else if (currency === 'SOL') {
          txResponse = await fetch(`${baseUrl}/solana/account/transaction/${wallet.address}?pageSize=50`, {
            method: 'GET',
            headers
          })
        }

        const txData = await txResponse?.json()
        
        result = {
          address: wallet.address,
          transactions: txData || [],
          currency
        }
        break
      }

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    console.log(`Action ${action} completed successfully`)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Crypto wallet manager error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
