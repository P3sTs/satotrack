
// Supabase Edge Function para monitoramento de alertas
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Alert {
  id: string;
  user_id: string;
  title: string;
  alert_type: 'balance' | 'transaction' | 'price' | 'volume';
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  currency: string;
  wallet_id?: string;
  is_active: boolean;
  notification_methods: string[];
}

interface MarketData {
  bitcoin: {
    brl: number;
    usd: number;
    usd_24h_change: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🚨 SatoAlerta Monitor - Executando verificação de alertas...')

    // Buscar todos os alertas ativos
    const { data: alerts, error: alertsError } = await supabaseClient
      .from('user_alerts')
      .select('*')
      .eq('is_active', true)

    if (alertsError) {
      console.error('Erro ao buscar alertas:', alertsError)
      throw alertsError
    }

    if (!alerts || alerts.length === 0) {
      console.log('Nenhum alerta ativo encontrado')
      return new Response(
        JSON.stringify({ message: 'Nenhum alerta ativo' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Encontrados ${alerts.length} alertas ativos`)

    // Buscar dados de mercado atuais
    const coingeckoResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl,usd&include_24hr_change=true'
    )

    if (!coingeckoResponse.ok) {
      throw new Error('Erro ao buscar dados de mercado')
    }

    const marketData: MarketData = await coingeckoResponse.json()
    const bitcoinPrice = {
      brl: marketData.bitcoin.brl,
      usd: marketData.bitcoin.usd,
      change24h: marketData.bitcoin.usd_24h_change
    }

    console.log('Preços atuais:', bitcoinPrice)

    let alertsTriggered = 0

    // Verificar cada alerta
    for (const alert of alerts as Alert[]) {
      try {
        let shouldTrigger = false
        let currentValue = 0

        // Determinar o valor atual baseado no tipo de alerta
        switch (alert.alert_type) {
          case 'price':
            currentValue = alert.currency === 'BRL' ? bitcoinPrice.brl : bitcoinPrice.usd
            break
          
          case 'balance':
            // Para alertas de saldo, buscar saldo da carteira específica
            if (alert.wallet_id) {
              const { data: wallet } = await supabaseClient
                .from('crypto_wallets')
                .select('balance')
                .eq('id', alert.wallet_id)
                .single()
              
              currentValue = wallet?.balance || 0
            }
            break
          
          case 'volume':
            // Para volume, usar mudança de 24h como proxy
            currentValue = Math.abs(bitcoinPrice.change24h)
            break
          
          default:
            continue
        }

        // Verificar condição do alerta
        switch (alert.condition) {
          case 'above':
            shouldTrigger = currentValue > alert.threshold
            break
          case 'below':
            shouldTrigger = currentValue < alert.threshold
            break
          case 'equals':
            // Margem de 1% para igualdade
            const margin = alert.threshold * 0.01
            shouldTrigger = Math.abs(currentValue - alert.threshold) <= margin
            break
        }

        if (shouldTrigger) {
          console.log(`🚨 Alerta disparado: ${alert.title}`)
          alertsTriggered++

          // Registrar alerta disparado
          await supabaseClient
            .from('notification_logs')
            .insert({
              user_id: alert.user_id,
              notification_type: `alert_${alert.alert_type}`,
              status: 'sent',
              details: {
                alert_id: alert.id,
                alert_title: alert.title,
                current_value: currentValue,
                threshold: alert.threshold,
                condition: alert.condition,
                triggered_at: new Date().toISOString()
              }
            })

          // Aqui seria implementada a lógica para enviar notificações
          // Por enquanto apenas registramos o evento
          
          // Opcional: Desativar alerta após ser disparado (evitar spam)
          if (alert.alert_type === 'price') {
            await supabaseClient
              .from('user_alerts')
              .update({ is_active: false })
              .eq('id', alert.id)
          }
        }
      } catch (error) {
        console.error(`Erro ao processar alerta ${alert.id}:`, error)
      }
    }

    const response = {
      success: true,
      message: `Verificação concluída`,
      stats: {
        alerts_checked: alerts.length,
        alerts_triggered: alertsTriggered,
        market_data: bitcoinPrice,
        timestamp: new Date().toISOString()
      }
    }

    console.log('✅ Verificação de alertas concluída:', response.stats)

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Erro no SatoAlerta Monitor:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
