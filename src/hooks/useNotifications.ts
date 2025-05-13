
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  requestPushPermission, 
  checkPushNotificationsSupport 
} from '@/services/notifications';
import { toast } from '@/components/ui/sonner';

interface NotificationSettings {
  telegram_chat_id: string | null;
  telegram_notifications_enabled: boolean;
  email_daily_summary: boolean;
  email_weekly_summary: boolean;
  push_notifications_enabled: boolean;
  price_alert_threshold: number;
  balance_alert_threshold: number;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | null>(null);
  
  // Check notification permission status
  useEffect(() => {
    const checkPermissions = () => {
      const isSupported = checkPushNotificationsSupport();
      setPushSupported(isSupported);
      
      if (isSupported && 'Notification' in window) {
        setPushPermission(Notification.permission);
      }
    };
    
    checkPermissions();
  }, []);
  
  // Load user notification settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw error;
        }
        
        if (data) {
          setSettings({
            telegram_chat_id: data.telegram_chat_id,
            telegram_notifications_enabled: data.telegram_notifications_enabled || false,
            email_daily_summary: data.email_daily_summary || false,
            email_weekly_summary: data.email_weekly_summary || false,
            push_notifications_enabled: data.push_notifications_enabled || false,
            price_alert_threshold: data.price_alert_threshold || 5,
            balance_alert_threshold: data.balance_alert_threshold || 0
          });
        } else {
          // Create default settings
          const defaultSettings = {
            telegram_chat_id: null,
            telegram_notifications_enabled: false,
            email_daily_summary: false,
            email_weekly_summary: false,
            push_notifications_enabled: false,
            price_alert_threshold: 5,
            balance_alert_threshold: 0
          };
          
          setSettings(defaultSettings);
          
          // Save default settings to database
          if (user) {
            await supabase
              .from('user_settings')
              .upsert({
                user_id: user.id,
                ...defaultSettings
              });
          }
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
        toast.error('Não foi possível carregar suas configurações de notificação');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [user]);
  
  // Request push permission
  const requestPermission = async (): Promise<boolean> => {
    if (!pushSupported) {
      toast.error('Este navegador não suporta notificações push');
      return false;
    }
    
    try {
      const granted = await requestPushPermission();
      setPushPermission(granted ? 'granted' : 'denied');
      
      if (granted && user && settings) {
        // Update user settings
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            push_notifications_enabled: true,
            ...settings
          });
        
        setSettings({
          ...settings,
          push_notifications_enabled: true
        });
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting push permission:', error);
      return false;
    }
  };
  
  // Update notification settings
  const updateSettings = async (newSettings: Partial<NotificationSettings>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings
      };
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setSettings(updatedSettings as NotificationSettings);
      return true;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return false;
    }
  };
  
  return {
    settings,
    loading,
    pushSupported,
    pushPermission,
    requestPermission,
    updateSettings
  };
};
