
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const callOpenAI = async (systemPrompt: string, message: string) => {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key não configurada');
  }

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

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const callGemini = async (systemPrompt: string, message: string) => {
  if (!geminiApiKey) {
    throw new Error('Gemini API key não configurada');
  }

  const prompt = `${systemPrompt}\n\nUsuário: ${message}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('SatoAI Chat function called');

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

    const { message, context, provider = 'gemini' } = requestBody;

    console.log('SatoAI Chat request received:', { 
      message: message?.substring(0, 100) + '...', 
      context,
      provider,
      hasOpenAIKey: !!openAIApiKey,
      hasGeminiKey: !!geminiApiKey
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

    let aiResponse;
    let usedProvider = provider;

    try {
      if (provider === 'gemini' && geminiApiKey) {
        console.log('Tentando Gemini...');
        aiResponse = await callGemini(systemPrompt, message);
        usedProvider = 'gemini';
      } else if (provider === 'openai' && openAIApiKey) {
        console.log('Tentando OpenAI...');
        aiResponse = await callOpenAI(systemPrompt, message);
        usedProvider = 'openai';
      } else {
        // Fallback: tentar qualquer API disponível
        if (geminiApiKey) {
          console.log('Fallback para Gemini...');
          aiResponse = await callGemini(systemPrompt, message);
          usedProvider = 'gemini';
        } else if (openAIApiKey) {
          console.log('Fallback para OpenAI...');
          aiResponse = await callOpenAI(systemPrompt, message);
          usedProvider = 'openai';
        } else {
          throw new Error('Nenhuma API de IA configurada');
        }
      }
    } catch (error) {
      console.error(`Erro com ${provider}:`, error);
      
      // Tentar provider alternativo
      try {
        if (provider === 'openai' && geminiApiKey) {
          console.log('Tentando Gemini como fallback...');
          aiResponse = await callGemini(systemPrompt, message);
          usedProvider = 'gemini';
        } else if (provider === 'gemini' && openAIApiKey) {
          console.log('Tentando OpenAI como fallback...');
          aiResponse = await callOpenAI(systemPrompt, message);
          usedProvider = 'openai';
        } else {
          throw error;
        }
      } catch (fallbackError) {
        console.error('Todos os providers falharam:', fallbackError);
        throw new Error('Todos os modelos de IA estão indisponíveis no momento');
      }
    }

    if (!aiResponse) {
      throw new Error('Resposta vazia da IA');
    }

    console.log(`SatoAI response generated successfully via ${usedProvider}, length:`, aiResponse.length);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      provider: usedProvider,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro geral na função satoai-chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do SatoAI. Tente novamente em alguns instantes.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
