
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

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ 
        error: 'Configuração da IA não encontrada. Tente novamente mais tarde.',
        details: 'API key missing' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `Você é o SatoAI, um assistente especializado em Bitcoin e criptomoedas da plataforma SatoTrack. 
    
    Características:
    - Você é expert em análise de Bitcoin, blockchain e mercado de criptomoedas
    - Fornece insights precisos sobre movimentos de preço, análise técnica e tendências
    - Oferece recomendações de investimento baseadas em dados
    - Sempre menciona os riscos envolvidos em investimentos
    - Usa linguagem clara e acessível
    - Pode analisar dados de carteiras e transações quando fornecidos
    - Mantém um tom profissional mas amigável
    - Seja conciso e direto nas respostas
    
    Contexto atual do usuário: ${context || 'Usuário navegando no dashboard SatoTrack'}
    
    Responda sempre em português brasileiro e seja conciso mas informativo.`;

    // Retry logic for rate limiting
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} to call OpenAI API`);
        
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
            max_tokens: 800,
            temperature: 0.7,
          }),
        });

        if (response.status === 429) {
          // Rate limiting - wait and retry
          attempts++;
          lastError = 'Rate limit exceeded';
          console.log(`Rate limit hit, waiting before retry ${attempts}/${maxAttempts}`);
          
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000 * attempts)); // Exponential backoff
            continue;
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid response format from OpenAI');
        }

        const aiResponse = data.choices[0].message.content;

        console.log('SatoAI response generated successfully');

        return new Response(JSON.stringify({ 
          response: aiResponse,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        lastError = error;
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error.message);
        
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }

    // All attempts failed
    console.error('All attempts failed, last error:', lastError);
    
    return new Response(JSON.stringify({ 
      error: 'O SatoAI está temporariamente sobrecarregado. Tente novamente em alguns instantes.',
      details: lastError?.message || 'Multiple attempts failed'
    }), {
      status: 503,
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
