import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SATOAI-CHAT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY não configurado");
    }

    const { message, conversation_history = [], context = "SatoTrack App" } = await req.json();
    
    if (!message) {
      throw new Error("message é obrigatório");
    }

    logStep("Processing chat message", { messageLength: message.length, historyLength: conversation_history.length, context });

    // Sistema de prompt especializado em Bitcoin e criptomoedas
    const systemPrompt = `Você é SatoAI, um assistente especializado em Bitcoin e criptomoedas brasileiro. 
    
Suas características:
- Focado em Bitcoin, educação financeira e tecnologia blockchain
- Linguagem amigável e acessível para usuários brasileiros
- Sempre atualizado com informações sobre o mercado cripto
- Prioriza segurança e boas práticas
- Responde em português brasileiro
- Evita dar conselhos financeiros específicos, mas oferece educação

Tópicos que você domina:
- Bitcoin e tecnologia blockchain
- Análise técnica básica
- Segurança de carteiras e private keys
- DeFi e protocolos descentralizados
- Regulamentação brasileira de criptomoedas
- Conceitos de economia austríaca
- História do Bitcoin e Satoshi Nakamoto

Sempre seja útil, educativo e seguro nas suas respostas.`;

    // Preparar mensagens para a API
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversation_history.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    // Chamar OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("Resposta vazia da OpenAI API");
    }

    logStep("AI response generated", { responseLength: aiResponse.length });

    return new Response(JSON.stringify({
      success: true,
      data: {
        response: aiResponse,
        message: aiResponse,
        usage: data.usage,
        model: data.model,
        timestamp: new Date().toISOString(),
        provider: "openai"
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});