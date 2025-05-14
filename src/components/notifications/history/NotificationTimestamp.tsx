
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationTimestampProps {
  timestamp: string;
}

const NotificationTimestamp: React.FC<NotificationTimestampProps> = ({ timestamp }) => {
  return (
    <p className="text-xs text-muted-foreground mt-1">
      {format(new Date(timestamp), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
    </p>
  );
};

export default NotificationTimestamp;
