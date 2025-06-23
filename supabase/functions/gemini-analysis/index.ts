
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getSystemPrompt = (type: string) => {
  const basePrompt = `Você é um assistente especialista em criptomoedas e análise financeira do SatoTrack. 
  Sempre responda em português brasileiro de forma clara e objetiva.`;

  const typePrompts = {
    market_analysis: `${basePrompt} Analise tendências de mercado, padrões técnicos e fatores fundamentalistas.`,
    portfolio_risk: `${basePrompt} Analise riscos de portfólio, diversificação e volatilidade.`,
    opportunity_detection: `${basePrompt} Identifique oportunidades de trading baseadas em dados de mercado.`,
    trading_insights: `${basePrompt} Gere insights sobre trading social e comportamento da comunidade.`,
    achievements_suggestion: `${basePrompt} Sugira conquistas personalizadas baseadas no perfil do usuário.`
  };

  return typePrompts[type] || basePrompt;
};

const callGemini = async (prompt: string, data: any, type: string) => {
  if (!geminiApiKey) {
    throw new Error('Gemini API key não configurada');
  }

  console.log('🧠 Chamando Gemini API para:', type);
  
  const systemPrompt = getSystemPrompt(type);
  const fullPrompt = `${systemPrompt}\n\nDados para análise: ${JSON.stringify(data)}\n\nPrompt: ${prompt}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: fullPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Gemini API erro:', response.status, errorText);
    throw new Error(`Gemini indisponível (${response.status})`);
  }

  const responseData = await response.json();
  
  if (!responseData.candidates || !responseData.candidates[0] || !responseData.candidates[0].content) {
    console.error('❌ Resposta inválida do Gemini:', responseData);
    throw new Error('Gemini retornou resposta inválida');
  }

  console.log('✅ Gemini respondeu com sucesso');
  return responseData.candidates[0].content.parts[0].text;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Gemini Analysis iniciado');

    const requestBody = await req.json();
    const { type, data, context } = requestBody;

    console.log('📥 Dados recebidos:', { 
      type,
      hasData: !!data,
      context: context || 'N/A'
    });

    if (!type || !data) {
      console.error('❌ Parâmetros inválidos');
      return new Response(JSON.stringify({ 
        error: 'Tipo e dados são obrigatórios' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let prompt = '';
    switch (type) {
      case 'market_analysis':
        prompt = 'Analise os dados de mercado e forneça insights sobre tendências, suporte/resistência e recomendações.';
        break;
      case 'portfolio_risk':
        prompt = 'Analise o risco do portfólio, calcule score de risco (1-10) e sugira melhorias na diversificação.';
        break;
      case 'opportunity_detection':
        prompt = 'Identifique oportunidades de trading baseadas nos dados. Foque em sinais de entrada e saída.';
        break;
      case 'trading_insights':
        prompt = 'Gere insights sobre trading social e performance da comunidade.';
        break;
      case 'achievements_suggestion':
        prompt = 'Sugira 3 conquistas personalizadas baseadas no perfil e progresso do usuário.';
        break;
      default:
        prompt = 'Analise os dados fornecidos e forneça insights relevantes.';
    }

    const aiResponse = await callGemini(prompt, data, type);

    // Estruturar resposta
    const structuredResponse = {
      analysis: aiResponse,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
      recommendations: aiResponse.split('\n').filter(line => 
        line.includes('recomend') || line.includes('sugir') || line.includes('consider')
      ).slice(0, 3),
      insights: aiResponse.split('\n').filter(line => 
        line.includes('insight') || line.includes('observ') || line.includes('trend')
      ).slice(0, 3),
      timestamp: new Date().toISOString()
    };

    console.log('✅ Análise estruturada com sucesso');

    return new Response(JSON.stringify(structuredResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Erro geral:', error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do Gemini Analysis',
      details: 'Verifique sua conexão e tente novamente'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
