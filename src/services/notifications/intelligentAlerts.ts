
import { supabase } from '@/integrations/supabase/client';
import { sendPushNotification } from './push';
import { sendTelegramNotification } from './telegram';
import { sendEmailSummary } from './email';
import { logNotification } from './logger';

// Tipos de alertas inteligentes
export type IntelligentAlertType = 'pattern' | 'opportunity' | 'risk' | 'insight';

// Interface para detalhes de alerta inteligente
export interface IntelligentAlertDetails {
  type: IntelligentAlertType;
  message: string;
  data?: any;
  confidence?: number;
  source?: string;
}

// Função para alertas inteligentes baseados em padrões do usuário
export const sendIntelligentAlert = async (
  userId: string,
  alertType: IntelligentAlertType,
  message: string,
  details: any = {}
) => {
  try {
    // Verificar se o usuário é premium
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', userId)
      .single();
    
    if (!userPlan || userPlan.plan_type !== 'premium') return false; // Somente para usuários premium
    
    // Obter configurações de notificação do usuário
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (!settings) return false;
    
    // Registrar alerta
    await logNotification(userId, `intelligent_${alertType}`, 'created', details);
    
    // Enviar por todos os canais configurados
    if (settings.push_notifications_enabled && Notification.permission === 'granted') {
      sendPushNotification(`🧠 Insight Inteligente SatoTrack`, {
        body: message,
        tag: `intelligent-${alertType}`
      });
    }
    
    if (settings.telegram_notifications_enabled && settings.telegram_chat_id) {
      await sendTelegramNotification(userId, message, `intelligent_${alertType}`, details);
    }
    
    if (settings.email_daily_summary || settings.email_weekly_summary) {
      // Incluir no próximo relatório
      // Opcionalmente, enviar email imediato para insights importantes
      if (alertType === 'opportunity' || alertType === 'risk') {
        await sendEmailSummary(userId, 'daily', {
          includeTransactions: false,
          includeMarketAnalysis: true,
          includePriceAlerts: false
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao enviar alerta inteligente (${alertType}):`, error);
    return false;
  }
};
