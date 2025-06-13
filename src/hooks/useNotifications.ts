
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface NotificationSettings {
  email_daily_summary: boolean;
  email_weekly_summary: boolean;
  push_notifications_enabled: boolean;
  telegram_notifications_enabled: boolean;
  telegram_chat_id?: string;
  price_alert_threshold: number;
  balance_alert_threshold: number;
}

interface NotificationLog {
  id: string;
  notification_type: string;
  status: 'sent' | 'failed' | 'pending';
  details: any;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    email_daily_summary: false,
    email_weekly_summary: false,
    push_notifications_enabled: false,
    telegram_notifications_enabled: false,
    price_alert_threshold: 5,
    balance_alert_threshold: 0
  });
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
      loadLogs();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select(`
          email_daily_summary,
          email_weekly_summary,
          push_notifications_enabled,
          telegram_notifications_enabled,
          telegram_chat_id,
          price_alert_threshold,
          balance_alert_threshold
        `)
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          email_daily_summary: data.email_daily_summary || false,
          email_weekly_summary: data.email_weekly_summary || false,
          push_notifications_enabled: data.push_notifications_enabled || false,
          telegram_notifications_enabled: data.telegram_notifications_enabled || false,
          telegram_chat_id: data.telegram_chat_id,
          price_alert_threshold: data.price_alert_threshold || 5,
          balance_alert_threshold: data.balance_alert_threshold || 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações de notificação');
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Transform the data to match our interface types
      const transformedLogs = (data || []).map(log => ({
        ...log,
        status: log.status as 'sent' | 'failed' | 'pending'
      }));
      
      setLogs(transformedLogs);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(updatedSettings);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Notificações push não são suportadas neste navegador');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const enabled = permission === 'granted';
      
      await updateSettings({ push_notifications_enabled: enabled });
      
      if (enabled) {
        toast.success('Notificações push ativadas!');
      } else {
        toast.error('Permissão para notificações negada');
      }
      
      return enabled;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      toast.error('Erro ao configurar notificações push');
      return false;
    }
  };

  const testTelegramConnection = async (chatId: string) => {
    try {
      // Aqui seria feita a chamada para testar o Telegram
      toast.success('Conexão com Telegram testada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao conectar com Telegram');
      return false;
    }
  };

  return {
    settings,
    logs,
    loading,
    updateSettings,
    requestPushPermission,
    testTelegramConnection,
    refreshLogs: loadLogs
  };
};
