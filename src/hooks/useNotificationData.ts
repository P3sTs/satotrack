import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  status: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
}

export interface NotificationSettings {
  telegram_notifications_enabled: boolean;
  email_daily_summary: boolean;
  email_weekly_summary: boolean;
  push_notifications_enabled: boolean;
  price_alert_threshold: number;
  balance_alert_threshold: number;
  telegram_chat_id?: string;
}

export const useNotificationData = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    telegram_notifications_enabled: false,
    email_daily_summary: false,
    email_weekly_summary: false,
    push_notifications_enabled: false,
    price_alert_threshold: 5,
    balance_alert_threshold: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notification_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const notifs: NotificationData[] = (data || []).map(notif => {
        const details = notif.details as any || {};
        return {
          id: notif.id,
          type: notif.notification_type,
          title: details.title || 'Notificação',
          message: details.message || '',
          status: notif.status as 'success' | 'error' | 'warning' | 'info',
          timestamp: notif.created_at || '',
          read: details.read || false
        };
      });

      setNotifications(notifs);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadSettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          telegram_notifications_enabled: data.telegram_notifications_enabled || false,
          email_daily_summary: data.email_daily_summary || false,
          email_weekly_summary: data.email_weekly_summary || false,
          push_notifications_enabled: data.push_notifications_enabled || false,
          price_alert_threshold: data.price_alert_threshold || 5,
          balance_alert_threshold: data.balance_alert_threshold || 0,
          telegram_chat_id: data.telegram_chat_id
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de notificação:', error);
    }
  }, [user]);

  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Atualizar localmente
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }, []);

  const createNotification = useCallback(async (
    type: string,
    title: string,
    message: string,
    status: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('notification_logs')
        .insert({
          user_id: user.id,
          notification_type: type,
          status,
          details: {
            title,
            message,
            timestamp: new Date().toISOString(),
            read: false
          }
        });

      // Recarregar notificações
      loadNotifications();
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  }, [user, loadNotifications]);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadSettings();
    }
  }, [user, loadNotifications, loadSettings]);

  return {
    notifications,
    settings,
    isLoading,
    loadNotifications,
    loadSettings,
    updateSettings,
    markAsRead,
    createNotification,
    unreadCount: notifications.filter(n => !n.read).length
  };
};