
import { supabase } from '@/integrations/supabase/client';

// Tipos de sumários disponíveis
export type SummaryType = 'daily' | 'weekly' | 'monthly';

// Interface para configuração de relatórios
export interface EmailReportConfig {
  includeTransactions: boolean;
  includeMarketAnalysis: boolean;
  includePriceAlerts: boolean;
  format: 'html' | 'text' | 'pdf';
}

// Função para enviar sumário por email via Edge Function
export const sendEmailSummary = async (
  userId: string,
  summaryType: SummaryType = 'weekly',
  config: Partial<EmailReportConfig> = {}
) => {
  try {
    // Configurações padrão para relatórios
    const defaultConfig: EmailReportConfig = {
      includeTransactions: true,
      includeMarketAnalysis: true,
      includePriceAlerts: true,
      format: 'html'
    };
    
    // Mesclar configurações personalizadas com padrões
    const finalConfig = { ...defaultConfig, ...config };
    
    const { data, error } = await supabase.functions.invoke('send-email-summary', {
      body: {
        user_id: userId,
        summary_type: summaryType,
        config: finalConfig
      }
    });

    if (error) throw error;
    return data.success;
  } catch (error) {
    console.error(`Erro ao enviar sumário por email (${summaryType}):`, error);
    return false;
  }
};

// Função para agendar relatórios recorrentes
export const scheduleRecurringReport = async (
  userId: string,
  frequency: SummaryType,
  config: Partial<EmailReportConfig> = {}
) => {
  try {
    const { data, error } = await supabase.functions.invoke('schedule-email-report', {
      body: {
        user_id: userId,
        frequency,
        config
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao agendar relatório recorrente:', error);
    return null;
  }
};
