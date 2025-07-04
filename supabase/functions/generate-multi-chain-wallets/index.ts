import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 🌐 Todas as redes suportadas pela Tatum
const SUPPORTED_NETWORKS = [
  { symbol: 'ALGO', name: 'Algorand', endpoint: 'algorand' },
  { symbol: 'ARBITRUM', name: 'Arbitrum One', endpoint: 'arbitrum' },
  { symbol: 'AURORA', name: 'Aurora', endpoint: 'aurora' },
  { symbol: 'AVAX', name: 'Avalanche', endpoint: 'avalanche' },
  { symbol: 'BASE', name: 'Base', endpoint: 'base' },
  { symbol: 'BSC', name: 'BNB Smart Chain', endpoint: 'bnb' },
  { symbol: 'BTC', name: 'Bitcoin', endpoint: 'bitcoin' },
  { symbol: 'BCH', name: 'Bitcoin Cash', endpoint: 'bitcoincash' },
  { symbol: 'ADA', name: 'Cardano', endpoint: 'cardano' },
  { symbol: 'CELO', name: 'Celo', endpoint: 'celo' },
  { symbol: 'ATOM', name: 'Cosmos', endpoint: 'cosmos' },
  { symbol: 'DOGE', name: 'Dogecoin', endpoint: 'dogecoin' },
  { symbol: 'ETH', name: 'Ethereum', endpoint: 'ethereum' },
  { symbol: 'ETC', name: 'Ethereum Classic', endpoint: 'ethereumclassic' },
  { symbol: 'FTM', name: 'Fantom', endpoint: 'fantom' },
  { symbol: 'FLOW', name: 'Flow', endpoint: 'flow' },
  { symbol: 'LTC', name: 'Litecoin', endpoint: 'litecoin' },
  { symbol: 'MATIC', name: 'Polygon', endpoint: 'polygon' },
  { symbol: 'NEAR', name: 'NEAR Protocol', endpoint: 'near' },
  { symbol: 'OP', name: 'Optimism', endpoint: 'optimism' },
  { symbol: 'DOT', name: 'Polkadot', endpoint: 'polkadot' },
  { symbol: 'XRP', name: 'Ripple', endpoint: 'xrp' },
  { symbol: 'SOL', name: 'Solana', endpoint: 'solana' },
  { symbol: 'XLM', name: 'Stellar', endpoint: 'stellar' },
  { symbol: 'XTZ', name: 'Tezos', endpoint: 'tezos' },
  { symbol: 'TRON', name: 'Tron', endpoint: 'tron' },
  { symbol: 'VET', name: 'VeChain', endpoint: 'vechain' },
]

// 🔥 Redes priorizadas para geração inicial
const PRIORITY_NETWORKS = ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL', 'AVAX', 'BSC', 'ARBITRUM']

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId, networks = PRIORITY_NETWORKS, generateAll = false } = await req.json()
    console.log('🔒 Gerando carteiras multi-chain para usuário:', userId)
    
    const TATUM_API_KEY = Deno.env.get('TATUM_API_KEY')
    if (!TATUM_API_KEY) {
      throw new Error('TATUM_API_KEY não configurado')
    }

    // Create Supabase client with SERVICE ROLE
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Determinar quais redes gerar
    const networksToGenerate = generateAll 
      ? SUPPORTED_NETWORKS.map(n => n.symbol)
      : networks

    const generatedWallets = []
    const errors = []
    
    for (const networkSymbol of networksToGenerate) {
      try {
        // Verificar se já existe carteira para esta rede
        const { data: existingWallet } = await supabase
          .from('crypto_wallets')
          .select('id')
          .eq('user_id', userId)
          .eq('currency', networkSymbol)
          .single()

        if (existingWallet) {
          console.log(`✅ Carteira ${networkSymbol} já existe, pulando...`)
          continue
        }

        const network = SUPPORTED_NETWORKS.find(n => n.symbol === networkSymbol)
        if (!network) {
          console.log(`⚠️ Rede ${networkSymbol} não suportada, pulando...`)
          continue
        }

        console.log(`🔒 Gerando carteira ${networkSymbol} via Tatum...`)
        
        // Gerar wallet via Tatum API
        const walletResponse = await fetch(`https://api.tatum.io/v3/${network.endpoint}/wallet`, {
          method: 'GET',
          headers: {
            'x-api-key': TATUM_API_KEY,
            'Content-Type': 'application/json'
          }
        })

        if (!walletResponse.ok) {
          throw new Error(`Tatum API erro para ${networkSymbol}: ${walletResponse.statusText}`)
        }

        const walletData = await walletResponse.json()
        
        // Gerar endereço específico
        let address = ''
        let addressIndex = 0 // Usar índice 0 por padrão
        
        if (walletData.xpub || walletData.address) {
          if (walletData.address) {
            // Algumas redes retornam o endereço diretamente
            address = walletData.address
          } else {
            // Para redes que usam XPUB, gerar endereço derivado
            const addressResponse = await fetch(`https://api.tatum.io/v3/${network.endpoint}/address/${walletData.xpub}/${addressIndex}`, {
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
        }

        if (!address) {
          console.log(`⚠️ Não foi possível gerar endereço para ${networkSymbol}`)
          errors.push(`Falha ao gerar endereço para ${networkSymbol}`)
          continue
        }

        console.log(`🔒 Endereço ${networkSymbol} gerado: ${address}`)

        // Salvar no banco de dados
        const { data: newWallet, error: insertError } = await supabase
          .from('crypto_wallets')
          .insert({
            user_id: userId,
            currency: networkSymbol,
            address: address,
            xpub: walletData.xpub || null,
            name: `${network.name} Wallet`,
            balance: 0,
            native_token_balance: 0,
            tokens_data: [],
            total_received: 0,
            total_sent: 0,
            transaction_count: 0,
            address_type: networkSymbol.toLowerCase()
          })
          .select()
          .single()

        if (insertError) {
          console.error(`Erro ao salvar carteira ${networkSymbol}:`, insertError)
          errors.push(`Erro ao salvar ${networkSymbol}: ${insertError.message}`)
        } else {
          generatedWallets.push(newWallet)
          console.log(`✅ Carteira ${networkSymbol} criada com sucesso`)
        }

      } catch (error) {
        console.error(`Erro na geração da carteira ${networkSymbol}:`, error)
        errors.push(`${networkSymbol}: ${error.message}`)
      }
    }

    console.log(`🔒 Processo concluído: ${generatedWallets.length} carteiras geradas, ${errors.length} erros`)

    return new Response(
      JSON.stringify({
        success: true,
        wallets: generatedWallets,
        errors: errors,
        summary: {
          generated: generatedWallets.length,
          failed: errors.length,
          total_requested: networksToGenerate.length
        },
        message: `${generatedWallets.length} carteiras geradas com segurança via Tatum KMS`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('🚨 Erro na geração multi-chain:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Erro interno na geração multi-chain',
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})