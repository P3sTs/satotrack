
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

interface NotificationLog {
  id: string;
  notification_type: string;
  status: string;
  details: any;
  created_at: string;
}

export const useNotificationHistory = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('notification_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        
        setNotifications(data || []);
      } catch (error) {
        console.error('Error loading notification history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotifications();
  }, [user]);
  
  return { loading, notifications };
};
