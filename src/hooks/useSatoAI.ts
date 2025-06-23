
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
      console.log('Enviando mensagem para SatoAI:', { message, context, preferredProvider });
      
      const { data, error } = await supabase.functions.invoke('satoai-chat', {
        body: {
          message: message.trim(),
          context: context || 'SatoTrack App',
          provider: preferredProvider || 'gemini' // Gemini como padrão
        }
      });

      console.log('Resposta bruta do SatoAI:', { data, error });

      if (error) {
        console.error('Erro na função Supabase:', error);
        
        // Se for erro de quota do OpenAI, tentar Gemini
        if (error.message?.includes('quota') || error.message?.includes('429')) {
          console.log('Tentando com Gemini devido a erro de quota OpenAI...');
          return askSatoAI(message, context, 'gemini');
        }
        
        toast.error(`Erro na comunicação: ${error.message}`);
        return null;
      }

      if (data?.error) {
        console.error('Erro na função SatoAI:', data.error);
        
        // Se OpenAI falhou, tentar Gemini
        if (data.error.includes('quota') || data.error.includes('OpenAI')) {
          console.log('OpenAI falhou, tentando Gemini...');
          toast.info('Conectando com modelo alternativo...');
          return askSatoAI(message, context, 'gemini');
        }
        
        toast.error(`Erro do SatoAI: ${data.error}`);
        return null;
      }

      if (!data?.response) {
        console.error('Resposta inválida do SatoAI:', data);
        toast.error('Resposta inválida do SatoAI');
        return null;
      }

      console.log('SatoAI respondeu com sucesso:', data.response);
      toast.success(`Resposta gerada via ${data.provider || 'IA'}`);
      return data.response;
      
    } catch (error) {
      console.error('Erro inesperado ao consultar SatoAI:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        toast.error('Limite de uso atingido. Tentando modelo alternativo...');
        if (!preferredProvider || preferredProvider === 'openai') {
          return askSatoAI(message, context, 'gemini');
        }
      } else if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
        toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        toast.error('Erro ao se comunicar com o SatoAI. Tente novamente.');
      }
      
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
      const response = await askSatoAI('Teste de conexão. Responda apenas "Conectado!" se estiver funcionando.', 'Teste');
      return response !== null;
    } catch {
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
