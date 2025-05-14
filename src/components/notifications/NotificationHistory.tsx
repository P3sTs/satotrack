
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationsLoading from './history/NotificationsLoading';
import NotificationsList from './history/NotificationsList';
import { useNotificationHistory } from './history/useNotificationHistory';

const NotificationHistory = () => {
  const { loading, notifications } = useNotificationHistory();
  
  if (loading) {
    return (
      <Card>
        <NotificationsLoading />
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
        <NotificationsList notifications={notifications} />
      </CardContent>
    </Card>
  );
};

export default NotificationHistory;
