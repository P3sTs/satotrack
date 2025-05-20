
import { supabase } from '@/integrations/supabase/client';

// Interface para o evento de notificação
export interface NotificationEvent {
  user_id: string;
  type: string;
  status: 'created' | 'sent' | 'delivered' | 'read' | 'failed';
  details?: any;
  created_at?: string;
}

/**
 * Registra um evento de notificação no histórico
 * @param userId ID do usuário
 * @param type Tipo da notificação (price_alert, transaction_received, etc)
 * @param status Status da notificação
 * @param details Detalhes adicionais (opcional)
 * @returns O ID do registro criado ou null em caso de erro
 */
export const logNotification = async (
  userId: string,
  type: string,
  status: 'created' | 'sent' | 'delivered' | 'read' | 'failed',
  details: any = {}
): Promise<string | null> => {
  try {
    const event: NotificationEvent = {
      user_id: userId,
      type,
      status,
      details,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('notification_logs')
      .insert(event)
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao registrar notificação:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Erro inesperado ao registrar notificação:', error);
    return null;
  }
};

/**
 * Marca uma notificação como lida
 * @param notificationId ID da notificação
 * @param userId ID do usuário (para segurança)
 * @returns true se a operação foi bem-sucedida
 */
export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notification_logs')
      .update({ status: 'read' })
      .match({ id: notificationId, user_id: userId });

    if (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro inesperado ao atualizar notificação:', error);
    return false;
  }
};

/**
 * Obtém o histórico de notificações de um usuário
 * @param userId ID do usuário
 * @param limit Limite de registros (padrão: 50)
 * @param offset Deslocamento para paginação
 * @returns Lista de notificações ou array vazio em caso de erro
 */
export const getNotificationHistory = async (
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<NotificationEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('notification_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Erro ao obter histórico de notificações:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro inesperado ao obter notificações:', error);
    return [];
  }
};

/**
 * Limpa notificações antigas (mais de 30 dias)
 * @param userId ID do usuário
 * @returns Número de notificações removidas ou -1 em caso de erro
 */
export const cleanupOldNotifications = async (userId: string): Promise<number> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('notification_logs')
      .delete()
      .eq('user_id', userId)
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select('count');

    if (error) {
      console.error('Erro ao limpar notificações antigas:', error);
      return -1;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('Erro inesperado ao limpar notificações:', error);
    return -1;
  }
};
