
import { supabase } from '@/integrations/supabase/client';

interface EmailSummaryOptions {
  includeTransactions: boolean;
  includeMarketAnalysis: boolean;
  includePriceAlerts: boolean;
}

export const sendEmailSummary = async (
  userId: string,
  type: 'daily' | 'weekly',
  options: EmailSummaryOptions
) => {
  try {
    // Verificar se o usuário tem email summary habilitado
    const { data: settings } = await supabase
      .from('user_settings')
      .select('email_daily_summary, email_weekly_summary')
      .eq('user_id', userId)
      .single();

    if (!settings) return false;

    const isEnabled = type === 'daily' ? settings.email_daily_summary : settings.email_weekly_summary;
    
    if (!isEnabled) {
      console.log(`Email ${type} summary não está habilitado para o usuário`);
      return false;
    }

    // Aqui seria implementada a lógica para enviar email via Supabase Edge Function
    // Por enquanto, apenas registrar a intenção
    console.log(`Enviando email ${type} summary para usuário ${userId}`);

    // Registrar o envio - convert options to plain object for JSON compatibility
    const { error } = await supabase
      .from('notification_logs')
      .insert({
        user_id: userId,
        notification_type: `email_${type}_summary`,
        status: 'sent',
        details: {
          includeTransactions: options.includeTransactions,
          includeMarketAnalysis: options.includeMarketAnalysis,
          includePriceAlerts: options.includePriceAlerts
        }
      });

    if (error) {
      console.error('Erro ao registrar envio de email:', error);
    }

    return true;
  } catch (error) {
    console.error('Erro ao enviar email summary:', error);
    return false;
  }
};

// Função para envio de email via Supabase Edge Function (futura implementação)
export const sendEmailViaEdgeFunction = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html: htmlContent
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao enviar email via Edge Function:', error);
    return null;
  }
};
