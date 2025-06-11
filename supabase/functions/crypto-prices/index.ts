
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Cache para guardar os preços por um curto período
let priceCache: any = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 60 * 1000; // 60 segundos

serve(async (req) => {
  // Tratar requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar se temos um cache válido
    const now = Date.now();
    if (priceCache && (now - lastCacheUpdate < CACHE_TTL)) {
      console.log("Retornando preços do cache");
      return new Response(JSON.stringify({
        success: true,
        data: priceCache,
        cached: true,
        cache_age_seconds: Math.round((now - lastCacheUpdate) / 1000)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log("Buscando novos preços da Binance");

    // Símbolos que queremos buscar
    const symbols = ['BTCBRL', 'BTCUSDT', 'ETHBRL', 'ETHUSDT', 'BNBBRL', 'BNBUSDT'];
    
    // Fetch prices from Binance
    const binancePromises = symbols.map(symbol => 
      fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
        .then(res => res.json())
    );
    
    const responses = await Promise.all(binancePromises);
    
    // Formatar os dados em um objeto para fácil acesso
    const prices = responses.reduce((acc: any, curr: any) => {
      if (curr && curr.symbol && curr.price) {
        acc[curr.symbol] = Number(curr.price);
      }
      return acc;
    }, {});
    
    // Adicionar conversões úteis
    prices['BTC_USD'] = prices['BTCUSDT'];
    prices['BTC_BRL'] = prices['BTCBRL'];
    prices['ETH_USD'] = prices['ETHUSDT'];
    prices['ETH_BRL'] = prices['ETHBRL'];
    prices['BNB_USD'] = prices['BNBUSDT'];
    prices['BNB_BRL'] = prices['BNBBRL'];
    
    // Preços calculados
    if (prices['BTCUSDT'] && prices['BTCBRL']) {
      prices['USD_BRL'] = prices['BTCBRL'] / prices['BTCUSDT'];
    }
    
    // Timestamp da atualização
    const timestamp = new Date().toISOString();
    
    // Atualizar o cache
    priceCache = {
      prices,
      timestamp,
    };
    lastCacheUpdate = now;
    
    // Salvar os preços no banco de dados para análises históricas
    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Salvar dados apenas uma vez a cada 5 minutos para não sobrecarregar o banco
    const FIVE_MINUTES = 5 * 60 * 1000;
    const { data: lastPriceRecord } = await supabase
      .from('market_prices')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1);
      
    const shouldSaveToDb = !lastPriceRecord || 
      !lastPriceRecord.length || 
      (now - new Date(lastPriceRecord[0].created_at).getTime() > FIVE_MINUTES);
      
    if (shouldSaveToDb) {
      await supabase.from('market_prices').insert({
        btc_usd: prices['BTC_USD'],
        btc_brl: prices['BTC_BRL'],
        eth_usd: prices['ETH_USD'],
        eth_brl: prices['ETH_BRL'],
        bnb_usd: prices['BNB_USD'], 
        bnb_brl: prices['BNB_BRL'],
        usd_brl: prices['USD_BRL'] || null,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: priceCache,
      cached: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error) {
    console.error('Erro ao buscar preços:', error);
    
    // Se temos um cache, retorne-o mesmo que esteja vencido
    if (priceCache) {
      console.log("Retornando cache expirado devido a erro");
      return new Response(JSON.stringify({
        success: true,
        data: priceCache,
        cached: true,
        cache_expired: true,
        error: "Erro ao atualizar preços, usando cache vencido"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Erro ao buscar preços de criptomoedas'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
