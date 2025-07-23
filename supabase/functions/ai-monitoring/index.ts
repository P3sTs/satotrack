import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-MONITORING] ${step}${detailsStr}`);
};

interface AIHealthCheck {
  service: string;
  status: 'operational' | 'degraded' | 'offline';
  responseTime: number;
  lastCheck: string;
  errorCount: number;
}

interface AIUsageStats {
  service: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastHour: number;
  lastDay: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("AI Monitoring started");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action } = await req.json();
    
    switch (action) {
      case 'health_check':
        const healthChecks = await performHealthChecks();
        return new Response(JSON.stringify({
          success: true,
          data: {
            services: healthChecks,
            overall_status: healthChecks.every(h => h.status === 'operational') ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      case 'usage_stats':
        const stats = await getUsageStats(supabase);
        return new Response(JSON.stringify({
          success: true,
          data: stats
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      case 'test_ai_services':
        const testResults = await testAIServices();
        return new Response(JSON.stringify({
          success: true,
          data: testResults
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      default:
        throw new Error(`Ação não suportada: ${action}`);
    }

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

async function performHealthChecks(): Promise<AIHealthCheck[]> {
  const services = [
    { name: 'satoai-chat', endpoint: 'satoai-chat' },
    { name: 'gemini-analysis', endpoint: 'gemini-analysis' },
    { name: 'tatum-token-swap', endpoint: 'tatum-token-swap' }
  ];

  const healthChecks: AIHealthCheck[] = [];

  for (const service of services) {
    const startTime = Date.now();
    let status: 'operational' | 'degraded' | 'offline' = 'offline';
    let errorCount = 0;

    try {
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/${service.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });

      if (response.ok) {
        status = 'operational';
      } else {
        status = 'degraded';
        errorCount = 1;
      }
    } catch (error) {
      console.error(`Health check failed for ${service.name}:`, error);
      status = 'offline';
      errorCount = 1;
    }

    const responseTime = Date.now() - startTime;

    healthChecks.push({
      service: service.name,
      status,
      responseTime,
      lastCheck: new Date().toISOString(),
      errorCount
    });
  }

  return healthChecks;
}

async function getUsageStats(supabase: any): Promise<AIUsageStats[]> {
  // Simular estatísticas de uso - em produção, isso viria de logs reais
  const services = ['satoai-chat', 'gemini-analysis', 'tatum-token-swap'];
  
  const stats: AIUsageStats[] = services.map(service => ({
    service,
    totalRequests: Math.floor(Math.random() * 1000) + 100,
    successfulRequests: Math.floor(Math.random() * 900) + 80,
    failedRequests: Math.floor(Math.random() * 100) + 5,
    averageResponseTime: Math.floor(Math.random() * 2000) + 500,
    lastHour: Math.floor(Math.random() * 50) + 10,
    lastDay: Math.floor(Math.random() * 500) + 100
  }));

  return stats;
}

async function testAIServices(): Promise<any> {
  const testResults = {
    openai: await testOpenAI(),
    gemini: await testGemini(),
    tatum: await testTatum()
  };

  return testResults;
}

async function testOpenAI(): Promise<{ status: string; error?: string }> {
  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return { status: 'error', error: 'API key não configurada' };
    }

    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
      },
    });

    if (response.ok) {
      return { status: 'operational' };
    } else {
      return { status: 'error', error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

async function testGemini(): Promise<{ status: string; error?: string }> {
  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return { status: 'error', error: 'API key não configurada' };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`);

    if (response.ok) {
      return { status: 'operational' };
    } else {
      return { status: 'error', error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

async function testTatum(): Promise<{ status: string; error?: string }> {
  try {
    const tatumApiKey = Deno.env.get("TATUM_API_KEY");
    if (!tatumApiKey) {
      return { status: 'error', error: 'API key não configurada' };
    }

    const response = await fetch("https://api.tatum.io/v3/tatum/rate/BTC", {
      headers: {
        "x-api-key": tatumApiKey,
      },
    });

    if (response.ok) {
      return { status: 'operational' };
    } else {
      return { status: 'error', error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}