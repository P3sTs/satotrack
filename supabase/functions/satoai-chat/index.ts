
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
    console.log('SatoAI Chat function called');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      return new Response(JSON.stringify({ 
        error: 'Configuração da IA não encontrada. A API key não está configurada.',
        details: 'OPENAI_API_KEY missing from environment' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Formato de dados inválido',
        details: 'Invalid JSON in request body' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, context } = requestBody;

    console.log('SatoAI Chat request received:', { 
      message: message?.substring(0, 100) + '...', 
      context,
      hasApiKey: !!openAIApiKey 
    });

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'Mensagem é obrigatória e deve ser uma string',
        details: 'Message is required and must be a string' 
      }), {
        status: 400,
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
        console.log(`Tentativa ${attempts + 1} de chamar a API OpenAI`);
        
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

        console.log('OpenAI response status:', response.status);

        if (response.status === 429) {
          // Rate limiting - wait and retry
          attempts++;
          lastError = 'Rate limit exceeded';
          console.log(`Rate limit atingido, aguardando antes da tentativa ${attempts}/${maxAttempts}`);
          
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000 * attempts)); // Exponential backoff
            continue;
          }
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI API error response:', response.status, errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: { message: errorText } };
          }
          
          throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('OpenAI response structure:', { 
          hasChoices: !!data.choices, 
          choicesLength: data.choices?.length,
          hasMessage: !!data.choices?.[0]?.message,
          hasContent: !!data.choices?.[0]?.message?.content
        });
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Formato de resposta inválido da OpenAI');
        }

        const aiResponse = data.choices[0].message.content;

        if (!aiResponse) {
          throw new Error('Resposta vazia da OpenAI');
        }

        console.log('SatoAI response generated successfully, length:', aiResponse.length);

        return new Response(JSON.stringify({ 
          response: aiResponse,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        lastError = error;
        attempts++;
        console.error(`Tentativa ${attempts} falhou:`, error.message);
        
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }

    // All attempts failed
    console.error('Todas as tentativas falharam, último erro:', lastError);
    
    return new Response(JSON.stringify({ 
      error: 'O SatoAI está temporariamente indisponível. Tente novamente em alguns instantes.',
      details: lastError?.message || 'Multiple attempts failed'
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro geral na função satoai-chat:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do SatoAI. Tente novamente em alguns instantes.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
