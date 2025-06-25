
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CryptoWallet {
  currency: string;
  name: string;
  address: string;
  xpub?: string;
  privateKey?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const TATUM_API_KEY = Deno.env.get('TATUM_API_KEY')
    if (!TATUM_API_KEY) {
      throw new Error('TATUM_API_KEY não configurada')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabaseClient.auth.getUser(token)

    if (!user.user) {
      throw new Error('Não autorizado')
    }

    const { userId } = await req.json()

    if (!userId || userId !== user.user.id) {
      throw new Error('ID do usuário inválido')
    }

    console.log(`Gerando carteiras para usuário: ${userId}`)

    // Verificar se o usuário já possui carteiras
    const { data: existingWallets, error: checkError } = await supabaseClient
      .from('crypto_wallets')
      .select('currency')
      .eq('user_id', userId)
      .neq('address', 'pending_generation')

    if (checkError) {
      console.error('Erro ao verificar carteiras existentes:', checkError)
    }

    const existingCurrencies = new Set(existingWallets?.map(w => w.currency) || [])
    
    const currencies = ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL']
    const baseUrl = 'https://api.tatum.io/v3'
    const headers = {
      'x-api-key': TATUM_API_KEY,
      'Content-Type': 'application/json'
    }

    const results: CryptoWallet[] = []
    const errors: string[] = []

    for (const currency of currencies) {
      // Pular se o usuário já possui essa carteira
      if (existingCurrencies.has(currency)) {
        console.log(`Usuário já possui carteira ${currency}, pulando...`)
        continue
      }

      try {
        console.log(`Gerando carteira ${currency}...`)
        
        let walletResponse
        let addressResponse
        let walletData: any = {}
        let addressData: any = {}

        // Gerar carteira baseada na moeda
        if (currency === 'BTC') {
          walletResponse = await fetch(`${baseUrl}/bitcoin/wallet`, {
            method: 'GET',
            headers
          })
          walletData = await walletResponse.json()
          
          if (walletResponse.ok && walletData.xpub) {
            addressResponse = await fetch(`${baseUrl}/bitcoin/address/${walletData.xpub}/0`, {
              method: 'GET',
              headers
            })
            addressData = await addressResponse.json()
          }
        } else if (currency === 'ETH') {
          walletResponse = await fetch(`${baseUrl}/ethereum/wallet`, {
            method: 'GET',  
            headers
          })
          walletData = await walletResponse.json()
          
          if (walletResponse.ok && walletData.xpub) {
            addressResponse = await fetch(`${baseUrl}/ethereum/address/${walletData.xpub}/0`, {
              method: 'GET',
              headers
            })
            addressData = await addressResponse.json()
          }
        } else if (currency === 'MATIC') {
          walletResponse = await fetch(`${baseUrl}/polygon/wallet`, {
            method: 'GET',
            headers
          })
          walletData = await walletResponse.json()
          
          if (walletResponse.ok && walletData.xpub) {
            addressResponse = await fetch(`${baseUrl}/polygon/address/${walletData.xpub}/0`, {
              method: 'GET',
              headers
            })
            addressData = await addressResponse.json()
          }
        } else if (currency === 'SOL') {
          // Solana tem um endpoint diferente
          walletResponse = await fetch(`${baseUrl}/solana/wallet`, {
            method: 'GET',
            headers
          })
          walletData = await walletResponse.json()
          
          if (walletResponse.ok && walletData.address) {
            addressData = { address: walletData.address }
          }
        } else if (currency === 'USDT') {
          // USDT geralmente é ERC-20, usar Ethereum
          walletResponse = await fetch(`${baseUrl}/ethereum/wallet`, {
            method: 'GET',
            headers
          })
          walletData = await walletResponse.json()
          
          if (walletResponse.ok && walletData.xpub) {
            addressResponse = await fetch(`${baseUrl}/ethereum/address/${walletData.xpub}/0`, {
              method: 'GET',
              headers
            })
            addressData = await addressResponse.json()
          }
        }

        if (!walletResponse?.ok) {
          throw new Error(`Erro da API Tatum para ${currency}: ${walletData.message || 'Erro desconhecido'}`)
        }

        const finalAddress = addressData?.address || walletData?.address
        if (!finalAddress) {
          throw new Error(`Endereço não gerado para ${currency}`)
        }

        const cryptoWallet: CryptoWallet = {
          currency,
          name: `${currency} Wallet`,
          address: finalAddress,
          xpub: walletData.xpub,
          privateKey: walletData.privateKey
        }

        results.push(cryptoWallet)
        console.log(`Carteira ${currency} gerada com sucesso: ${finalAddress}`)

      } catch (error) {
        console.error(`Erro ao gerar carteira ${currency}:`, error)
        errors.push(`${currency}: ${error.message}`)
      }
    }

    // Salvar carteiras no banco de dados
    const walletsToSave = results.map(wallet => ({
      user_id: userId,
      currency: wallet.currency,
      name: wallet.name,
      address: wallet.address,
      xpub: wallet.xpub,
      private_key_encrypted: wallet.privateKey ? btoa(wallet.privateKey) : null, // Temporário - usar criptografia real em produção
      balance: 0,
      native_token_balance: 0,
      tokens_data: [],
      total_received: 0,
      total_sent: 0,
      transaction_count: 0
    }))

    if (walletsToSave.length > 0) {
      // Primeiro, deletar os registros "pending_generation" para estas moedas
      const { error: deleteError } = await supabaseClient
        .from('crypto_wallets')
        .delete()
        .eq('user_id', userId)
        .eq('address', 'pending_generation')
        .in('currency', results.map(w => w.currency))

      if (deleteError) {
        console.error('Erro ao limpar carteiras pendentes:', deleteError)
      }

      // Inserir as novas carteiras
      const { data: savedWallets, error: saveError } = await supabaseClient
        .from('crypto_wallets')
        .insert(walletsToSave)
        .select()

      if (saveError) {
        console.error('Erro ao salvar carteiras:', saveError)
        throw new Error(`Erro ao salvar carteiras: ${saveError.message}`)
      }

      console.log(`${savedWallets?.length || 0} carteiras salvas com sucesso`)
    }

    const response = {
      success: true,
      walletsGenerated: results.length,
      totalRequested: currencies.length,
      wallets: results.map(w => ({
        currency: w.currency,
        name: w.name,
        address: w.address
      })),
      errors: errors.length > 0 ? errors : undefined
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erro na geração de carteiras:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Erro interno do servidor'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
