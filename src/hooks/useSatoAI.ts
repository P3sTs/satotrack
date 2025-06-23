
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SatoAIResponse {
  response: string;
  timestamp: string;
  provider?: string;
}

interface AIProvider {
  name: string;
  available: boolean;
}

export const useSatoAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<AIProvider[]>([
    { name: 'gemini', available: true },
    { name: 'openai', available: true }
  ]);

  const askSatoAI = async (message: string, context?: string, preferredProvider?: string): Promise<string | null> => {
    if (!message.trim()) {
      toast.error('Digite uma mensagem para o SatoAI');
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('🤖 Enviando para SatoAI:', { 
        message: message.substring(0, 50) + '...',
        context,
        provider: preferredProvider || 'gemini'
      });
      
      const { data, error } = await supabase.functions.invoke('satoai-chat', {
        body: {
          message: message.trim(),
          context: context || 'SatoTrack App',
          provider: preferredProvider || 'gemini'
        }
      });

      console.log('📡 Resposta recebida:', { 
        success: !error,
        hasData: !!data,
        provider: data?.provider
      });

      if (error) {
        console.error('❌ Erro Supabase:', error);
        throw new Error('Erro na comunicação com SatoAI');
      }

      if (data?.error) {
        console.error('⚠️ Erro SatoAI:', data.error);
        throw new Error(data.error);
      }

      if (!data?.response) {
        console.error('📭 Resposta vazia:', data);
        throw new Error('SatoAI não respondeu');
      }

      console.log('✅ Sucesso via', data.provider || 'desconhecido');
      toast.success(`Resposta do SatoAI via ${data.provider || 'IA'}`);
      
      return data.response;
      
    } catch (error) {
      console.error('💥 Erro askSatoAI:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`SatoAI: ${errorMessage}`);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickInsight = async (walletData?: any): Promise<string | null> => {
    const context = walletData 
      ? `Análise de carteira - Saldo: ${walletData.saldo} BTC`
      : 'Insight de mercado Bitcoin';
      
    return askSatoAI(
      'Dê um insight rápido sobre Bitcoin e uma recomendação para hoje.',
      context
    );
  };

  const analyzePortfolio = async (portfolioData: any): Promise<string | null> => {
    return askSatoAI(
      'Analise meu portfolio e dê recomendações de otimização.',
      `Portfolio: ${JSON.stringify(portfolioData)}`
    );
  };

  const testConnection = async (): Promise<boolean> => {
    try {
      console.log('🔧 Testando SatoAI...');
      const response = await askSatoAI(
        'Teste. Responda apenas "Conectado!" se funcionando.',
        'Teste de Conectividade'
      );
      
      const isConnected = response !== null && response.toLowerCase().includes('conectado');
      console.log('🔗 Teste resultado:', isConnected ? 'Sucesso' : 'Falhou');
      return isConnected;
    } catch (error) {
      console.error('🚫 Teste falhou:', error);
      return false;
    }
  };

  return {
    askSatoAI,
    getQuickInsight,
    analyzePortfolio,
    testConnection,
    isLoading,
    providers
  };
};
