
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

  console.log('🤖 Chamando OpenAI API...');
  
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
    console.error('❌ OpenAI API erro:', response.status, errorText);
    throw new Error(`OpenAI indisponível (${response.status})`);
  }

  const data = await response.json();
  console.log('✅ OpenAI respondeu com sucesso');
  return data.choices[0].message.content;
};

const callGemini = async (systemPrompt: string, message: string) => {
  if (!geminiApiKey) {
    throw new Error('Gemini API key não configurada');
  }

  console.log('🤖 Chamando Gemini API...');
  
  const prompt = `${systemPrompt}\n\nUsuário: ${message}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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
    console.error('❌ Gemini API erro:', response.status, errorText);
    throw new Error(`Gemini indisponível (${response.status})`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    console.error('❌ Resposta inválida do Gemini:', data);
    throw new Error('Gemini retornou resposta inválida');
  }

  console.log('✅ Gemini respondeu com sucesso');
  return data.candidates[0].content.parts[0].text;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 SatoAI Chat iniciado');

    const requestBody = await req.json();
    const { message, context, provider = 'gemini' } = requestBody;

    console.log('📥 Dados recebidos:', { 
      messageLength: message?.length || 0,
      context: context || 'N/A',
      provider,
      hasOpenAIKey: !!openAIApiKey,
      hasGeminiKey: !!geminiApiKey
    });

    if (!message || typeof message !== 'string' || message.trim() === '') {
      console.error('❌ Mensagem inválida');
      return new Response(JSON.stringify({ 
        error: 'Mensagem é obrigatória e não pode estar vazia' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `Você é o SatoAI, um assistente especializado em Bitcoin e criptomoedas da plataforma SatoTrack.

CARACTERÍSTICAS:
- Expert em análise de Bitcoin, blockchain e mercado de criptomoedas
- Fornece insights sobre preços, análise técnica e tendências
- Oferece recomendações baseadas em dados
- Sempre menciona riscos em investimentos
- Linguagem clara e acessível
- Tom profissional mas amigável
- Respostas concisas e informativas

Contexto: ${context || 'Dashboard SatoTrack'}

Responda SEMPRE em português brasileiro de forma direta e útil.`;

    let aiResponse;
    let usedProvider = provider;

    // Tentar provider preferido primeiro
    try {
      if (provider === 'gemini' && geminiApiKey) {
        console.log('🔄 Tentando Gemini (preferido)...');
        aiResponse = await callGemini(systemPrompt, message.trim());
        usedProvider = 'gemini';
      } else if (provider === 'openai' && openAIApiKey) {
        console.log('🔄 Tentando OpenAI (preferido)...');
        aiResponse = await callOpenAI(systemPrompt, message.trim());
        usedProvider = 'openai';
      } else {
        throw new Error(`Provider ${provider} não configurado`);
      }
    } catch (primaryError) {
      console.log(`⚠️ Erro com ${provider}:`, primaryError.message);
      
      // Fallback para o outro provider
      try {
        if (provider === 'openai' && geminiApiKey) {
          console.log('🔄 Fallback para Gemini...');
          aiResponse = await callGemini(systemPrompt, message.trim());
          usedProvider = 'gemini';
        } else if (provider === 'gemini' && openAIApiKey) {
          console.log('🔄 Fallback para OpenAI...');
          aiResponse = await callOpenAI(systemPrompt, message.trim());
          usedProvider = 'openai';
        } else {
          throw new Error('Nenhum provider de IA disponível');
        }
      } catch (fallbackError) {
        console.error('💥 Todos os providers falharam:', fallbackError.message);
        throw new Error('Serviços de IA temporariamente indisponíveis');
      }
    }

    if (!aiResponse || typeof aiResponse !== 'string' || aiResponse.trim() === '') {
      throw new Error('IA retornou resposta vazia');
    }

    console.log(`✅ Resposta gerada via ${usedProvider}, tamanho: ${aiResponse.length} chars`);

    return new Response(JSON.stringify({ 
      response: aiResponse.trim(),
      provider: usedProvider,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Erro geral:', error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do SatoAI',
      details: 'Verifique sua conexão e tente novamente'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
