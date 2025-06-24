
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TatumWalletRequest {
  action: 'create_wallet' | 'get_balance' | 'send_transaction' | 'get_transactions'
  network: string
  address?: string
  privateKey?: string
  recipient?: string
  amount?: string
  memo?: string
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

    const { action, network, address, privateKey, recipient, amount, memo }: TatumWalletRequest = await req.json()

    const baseUrl = 'https://api.tatum.io/v3'
    const headers = {
      'x-api-key': TATUM_API_KEY,
      'Content-Type': 'application/json'
    }

    let result: any = {}

    switch (action) {
      case 'create_wallet': {
        console.log(`Creating wallet for network: ${network}`)
        
        // Generate wallet based on network
        let walletResponse
        
        if (network === 'BTC') {
          walletResponse = await fetch(`${baseUrl}/bitcoin/wallet`, {
            method: 'GET',
            headers
          })
        } else if (network === 'ETH') {
          walletResponse = await fetch(`${baseUrl}/ethereum/wallet`, {
            method: 'GET',
            headers
          })
        } else if (network === 'MATIC') {
          walletResponse = await fetch(`${baseUrl}/polygon/wallet`, {
            method: 'GET',
            headers
          })
        } else {
          throw new Error(`Unsupported network: ${network}`)
        }

        const walletData = await walletResponse.json()
        
        if (!walletResponse.ok) {
          throw new Error(`Tatum API error: ${walletData.message || 'Unknown error'}`)
        }

        // Generate address from wallet
        let addressResponse
        
        if (network === 'BTC') {
          addressResponse = await fetch(`${baseUrl}/bitcoin/address/${walletData.xpub}/0`, {
            method: 'GET',
            headers
          })
        } else if (network === 'ETH') {
          addressResponse = await fetch(`${baseUrl}/ethereum/address/${walletData.xpub}/0`, {
            method: 'GET',
            headers
          })
        } else if (network === 'MATIC') {
          addressResponse = await fetch(`${baseUrl}/polygon/address/${walletData.xpub}/0`, {
            method: 'GET',
            headers
          })
        }

        const addressData = await addressResponse?.json()

        result = {
          xpub: walletData.xpub,
          privateKey: walletData.privateKey,
          address: addressData?.address || 'Address generation failed',
          network: network
        }

        // Save wallet to database
        const { error: dbError } = await supabaseClient
          .from('crypto_wallets')
          .insert({
            user_id: user.user.id,
            network_id: null, // Will be set later
            name: `${network} Wallet`,
            address: result.address,
            address_type: network.toLowerCase(),
            balance: 0,
            native_token_balance: 0,
            tokens_data: [],
            total_received: 0,
            total_sent: 0,
            transaction_count: 0
          })

        if (dbError) {
          console.error('Database error:', dbError)
        }

        break
      }

      case 'get_balance': {
        if (!address) throw new Error('Address required for balance check')
        
        console.log(`Getting balance for ${network} address: ${address}`)
        
        let balanceResponse
        
        if (network === 'BTC') {
          balanceResponse = await fetch(`${baseUrl}/bitcoin/address/balance/${address}`, {
            method: 'GET',
            headers
          })
        } else if (network === 'ETH') {
          balanceResponse = await fetch(`${baseUrl}/ethereum/account/balance/${address}`, {
            method: 'GET',
            headers
          })
        } else if (network === 'MATIC') {
          balanceResponse = await fetch(`${baseUrl}/polygon/account/balance/${address}`, {
            method: 'GET',
            headers
          })
        }

        const balanceData = await balanceResponse?.json()
        
        if (!balanceResponse?.ok) {
          throw new Error(`Tatum API error: ${balanceData?.message || 'Unknown error'}`)
        }

        result = {
          address,
          balance: balanceData.incoming || balanceData.balance || '0',
          network
        }
        break
      }

      case 'get_transactions': {
        if (!address) throw new Error('Address required for transaction history')
        
        console.log(`Getting transactions for ${network} address: ${address}`)
        
        let txResponse
        
        if (network === 'BTC') {
          txResponse = await fetch(`${baseUrl}/bitcoin/transaction/address/${address}?pageSize=50`, {
            method: 'GET',
            headers
          })
        } else if (network === 'ETH') {
          txResponse = await fetch(`${baseUrl}/ethereum/account/transaction/${address}?pageSize=50`, {
            method: 'GET',
            headers
          })
        } else if (network === 'MATIC') {
          txResponse = await fetch(`${baseUrl}/polygon/account/transaction/${address}?pageSize=50`, {
            method: 'GET',
            headers
          })
        }

        const txData = await txResponse?.json()
        
        if (!txResponse?.ok) {
          throw new Error(`Tatum API error: ${txData?.message || 'Unknown error'}`)
        }

        result = {
          address,
          transactions: txData,
          network
        }
        break
      }

      case 'send_transaction': {
        if (!recipient || !amount || !privateKey) {
          throw new Error('Recipient, amount, and private key required for transaction')
        }
        
        console.log(`Sending ${amount} ${network} from ${address} to ${recipient}`)
        
        let txPayload: any = {}
        
        if (network === 'BTC') {
          txPayload = {
            fromAddress: [{
              address: address,
              privateKey: privateKey
            }],
            to: [{
              address: recipient,
              value: parseFloat(amount)
            }]
          }
        } else if (network === 'ETH' || network === 'MATIC') {
          const endpoint = network === 'ETH' ? 'ethereum' : 'polygon'
          txPayload = {
            data: memo || '',
            nonce: 0, // Should be fetched from network
            to: recipient,
            amount: amount,
            fromPrivateKey: privateKey
          }
        }

        const sendEndpoint = network === 'BTC' ? 
          `${baseUrl}/bitcoin/transaction` : 
          network === 'ETH' ? 
          `${baseUrl}/ethereum/transaction` : 
          `${baseUrl}/polygon/transaction`

        const sendResponse = await fetch(sendEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(txPayload)
        })

        const sendData = await sendResponse.json()
        
        if (!sendResponse.ok) {
          throw new Error(`Transaction failed: ${sendData.message || 'Unknown error'}`)
        }

        result = {
          txId: sendData.txId,
          network,
          from: address,
          to: recipient,
          amount,
          status: 'pending'
        }
        break
      }

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    console.log(`Tatum ${action} result:`, result)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Tatum API error:', error)
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
