
import React from 'react';
import { Loader2 } from 'lucide-react';
import { CardContent } from '@/components/ui/card';

const NotificationsLoading: React.FC = () => {
  return (
    <CardContent className="pt-6 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </CardContent>
  );
};

export default NotificationsLoading;
