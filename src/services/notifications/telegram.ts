
import { supabase } from '@/integrations/supabase/client';

// Interface para configuração de relatório Telegram
export interface TelegramReportConfig {
  includeCharts: boolean;
  includeSummary: boolean;
  includeRecommendations: boolean;
}

// Função para enviar uma notificação Telegram via Edge Function
export const sendTelegramNotification = async (
  userId: string,
  message: string,
  notificationType: string,
  details: any = {}
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-telegram', {
      body: {
        user_id: userId,
        message,
        notification_type: notificationType,
        details
      }
    });

    if (error) throw error;
    return data.success;
  } catch (error) {
    console.error('Erro ao enviar notificação Telegram:', error);
    return false;
  }
};

// Nova função para enviar relatório periódico via Telegram
export const sendTelegramReport = async (
  userId: string, 
  reportType: 'daily' | 'weekly' | 'monthly',
  config: Partial<TelegramReportConfig> = {}
) => {
  try {
    // Configuração padrão
    const defaultConfig: TelegramReportConfig = {
      includeCharts: true,
      includeSummary: true,
      includeRecommendations: false
    };
    
    // Mesclar configuração
    const finalConfig = { ...defaultConfig, ...config };
    
    const { data, error } = await supabase.functions.invoke('send-telegram-report', {
      body: {
        user_id: userId,
        report_type: reportType,
        config: finalConfig
      }
    });

    if (error) throw error;
    return data.success;
  } catch (error) {
    console.error(`Erro ao enviar relatório Telegram (${reportType}):`, error);
    return false;
  }
};

// Função para configurar bot Telegram para o usuário
export const configureTelegramBot = async (
  userId: string,
  telegramUsername: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('configure-telegram-bot', {
      body: {
        user_id: userId,
        telegram_username: telegramUsername
      }
    });
    
    if (error) throw error;
    return {
      success: data.success,
      chatId: data.chat_id,
      instructions: data.instructions
    };
  } catch (error) {
    console.error('Erro ao configurar bot Telegram:', error);
    return { success: false };
  }
};
