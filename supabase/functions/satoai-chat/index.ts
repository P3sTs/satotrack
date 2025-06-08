
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    console.log('SatoAI Chat request:', { message, context });

    const systemPrompt = `Você é o SatoAI, um assistente especializado em Bitcoin e criptomoedas da plataforma SatoTrack. 
    
    Características:
    - Você é expert em análise de Bitcoin, blockchain e mercado de criptomoedas
    - Fornece insights precisos sobre movimentos de preço, análise técnica e tendências
    - Oferece recomendações de investimento baseadas em dados
    - Sempre menciona os riscos envolvidos em investimentos
    - Usa linguagem clara e acessível
    - Pode analisar dados de carteiras e transações quando fornecidos
    - Mantém um tom profissional mas amigável
    
    Contexto atual do usuário: ${context || 'Usuário navegando no dashboard SatoTrack'}
    
    Responda sempre em português brasileiro e seja conciso mas informativo.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('SatoAI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in satoai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do SatoAI. Tente novamente em alguns instantes.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
