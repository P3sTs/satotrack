
import React from 'react';
import { Bell } from 'lucide-react';

const EmptyNotificationState: React.FC = () => {
  return (
    <div className="py-8 text-center">
      <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
      <p className="text-muted-foreground">
        Você ainda não recebeu nenhuma notificação
      </p>
    </div>
  );
};

export default EmptyNotificationState;
