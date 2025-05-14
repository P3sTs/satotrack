
import React from 'react';

interface NotificationDetails {
  direction?: string;
  percentage?: string;
  wallet_name?: string;
  amount?: number;
  message?: string;
}

interface NotificationMessageProps {
  type: string;
  details: NotificationDetails;
}

const NotificationMessage: React.FC<NotificationMessageProps> = ({ type, details }) => {
  switch (type) {
    case 'price_alert':
      return (
        <p className="font-medium">
          Preço do Bitcoin {details?.direction === 'up' ? 'subiu' : 'caiu'} {details?.percentage}% nas últimas 24h
        </p>
      );
    case 'transaction_received':
      return (
        <p className="font-medium">
          Sua carteira {details?.wallet_name || 'Bitcoin'} recebeu {details?.amount} BTC
        </p>
      );
    case 'transaction_sent':
      return (
        <p className="font-medium">
          Sua carteira {details?.wallet_name || 'Bitcoin'} enviou {details?.amount} BTC
        </p>
      );
    case 'daily_summary':
      return <p className="font-medium">Seu resumo diário foi enviado por email</p>;
    case 'weekly_summary':
      return <p className="font-medium">Seu resumo semanal foi enviado por email</p>;
    default:
      return <p className="font-medium">{details?.message || 'Notificação do sistema'}</p>;
  }
};

export default NotificationMessage;
