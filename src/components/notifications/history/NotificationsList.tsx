
import React from 'react';
import NotificationItem from './NotificationItem';
import EmptyNotificationState from './EmptyNotificationState';

interface NotificationLog {
  id: string;
  notification_type: string;
  status: string;
  details: any;
  created_at: string;
}

interface NotificationsListProps {
  notifications: NotificationLog[];
}

const NotificationsList: React.FC<NotificationsListProps> = ({ notifications }) => {
  if (notifications.length === 0) {
    return <EmptyNotificationState />;
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationsList;
