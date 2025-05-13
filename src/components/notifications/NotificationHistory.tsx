
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Bell, AlertTriangle, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface NotificationLog {
  id: string;
  notification_type: string;
  status: string;
  details: any;
  created_at: string;
}

const NotificationHistory = () => {
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

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'price_alert':
        return <TrendingUp className="h-5 w-5 text-yellow-500" />;
      case 'price_drop':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'transaction_received':
        return <Wallet className="h-5 w-5 text-green-500" />;
      case 'transaction_sent':
        return <Wallet className="h-5 w-5 text-blue-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Format notification message based on type and details
  const formatMessage = (notification: NotificationLog) => {
    const { notification_type, details } = notification;
    
    switch (notification_type) {
      case 'price_alert':
        return `Preço do Bitcoin ${details?.direction === 'up' ? 'subiu' : 'caiu'} ${details?.percentage}% nas últimas 24h`;
      case 'transaction_received':
        return `Sua carteira ${details?.wallet_name || 'Bitcoin'} recebeu ${details?.amount} BTC`;
      case 'transaction_sent':
        return `Sua carteira ${details?.wallet_name || 'Bitcoin'} enviou ${details?.amount} BTC`;
      case 'daily_summary':
        return 'Seu resumo diário foi enviado por email';
      case 'weekly_summary':
        return 'Seu resumo semanal foi enviado por email';
      default:
        return details?.message || 'Notificação do sistema';
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Notificações</CardTitle>
        <CardDescription>
          Últimas 50 notificações enviadas para você
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Você ainda não recebeu nenhuma notificação
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="flex items-start gap-3 p-3 rounded-md border"
              >
                <div className="mt-1">
                  {getNotificationIcon(notification.notification_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {formatMessage(notification)}
                    </p>
                    <Badge variant={notification.status === 'sent' ? 'outline' : 'destructive'}>
                      {notification.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(notification.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationHistory;
