
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SatoAIResponse {
  response: string;
  timestamp: string;
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
      toast.error('Por favor, digite uma mensagem para o SatoAI');
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('🤖 Enviando mensagem para SatoAI:', { message: message.substring(0, 50) + '...', context, preferredProvider });
      
      const { data, error } = await supabase.functions.invoke('satoai-chat', {
        body: {
          message: message.trim(),
          context: context || 'SatoTrack App',
          provider: preferredProvider || 'gemini'
        }
      });

      console.log('📡 Resposta do SatoAI:', { data, error });

      if (error) {
        console.error('❌ Erro na função Supabase:', error);
        throw new Error(error.message || 'Erro na comunicação com SatoAI');
      }

      if (data?.error) {
        console.error('⚠️ Erro interno do SatoAI:', data.error);
        throw new Error(data.error);
      }

      if (!data?.response) {
        console.error('📭 Resposta vazia do SatoAI:', data);
        throw new Error('SatoAI retornou uma resposta vazia');
      }

      console.log('✅ SatoAI respondeu com sucesso via', data.provider || 'desconhecido');
      toast.success(`Resposta gerada via ${data.provider || 'IA'}`);
      return data.response;
      
    } catch (error) {
      console.error('💥 Erro ao consultar SatoAI:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro do SatoAI: ${errorMessage}`);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickInsight = async (walletData?: any): Promise<string | null> => {
    const context = walletData 
      ? `Análise de carteira com saldo: ${walletData.saldo} BTC`
      : 'Insight geral do mercado';
      
    return askSatoAI(
      'Me dê um insight rápido sobre o mercado de Bitcoin atual e uma recomendação.',
      context
    );
  };

  const analyzePortfolio = async (portfolioData: any): Promise<string | null> => {
    const context = `Portfolio: ${JSON.stringify(portfolioData)}`;
    
    return askSatoAI(
      'Analise meu portfolio e dê recomendações de otimização e diversificação.',
      context
    );
  };

  const testConnection = async (): Promise<boolean> => {
    try {
      console.log('🔧 Testando conexão com SatoAI...');
      const response = await askSatoAI('Teste de conexão. Responda apenas "Conectado!" se estiver funcionando.', 'Teste de Conectividade');
      const isConnected = response !== null && response.toLowerCase().includes('conectado');
      console.log('🔗 Resultado do teste:', isConnected ? 'Sucesso' : 'Falhou');
      return isConnected;
    } catch (error) {
      console.error('🚫 Teste de conexão falhou:', error);
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
