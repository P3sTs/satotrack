
import React from 'react';
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, Bell } from 'lucide-react';

interface NotificationIconProps {
  type: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ type }) => {
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

export default NotificationIcon;
