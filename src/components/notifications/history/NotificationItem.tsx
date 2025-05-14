
import React from 'react';
import { Badge } from '@/components/ui/badge';
import NotificationIcon from './NotificationIcon';
import NotificationMessage from './NotificationMessage';
import NotificationTimestamp from './NotificationTimestamp';

interface NotificationItemProps {
  notification: {
    id: string;
    notification_type: string;
    status: string;
    details: any;
    created_at: string;
  };
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-md border">
      <div className="mt-1">
        <NotificationIcon type={notification.notification_type} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <NotificationMessage 
            type={notification.notification_type} 
            details={notification.details} 
          />
          <Badge variant={notification.status === 'sent' ? 'outline' : 'destructive'}>
            {notification.status}
          </Badge>
        </div>
        <NotificationTimestamp timestamp={notification.created_at} />
      </div>
    </div>
  );
};

export default NotificationItem;
