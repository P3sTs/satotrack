
import { checkPushNotificationsSupport, requestPushPermission, sendPushNotification } from './push';
import { sendTelegramNotification } from './telegram';
import { logNotification, sendPriceAlert, sendTransactionNotification } from './alerts';
import { sendEmailSummary } from './email';

// Sistema de notificações aprimorado
export {
  // Funções de notificação push
  checkPushNotificationsSupport,
  requestPushPermission,
  sendPushNotification,
  
  // Funções de notificação Telegram
  sendTelegramNotification,
  
  // Registro de notificações e funções de alerta
  logNotification,
  sendPriceAlert,
  sendTransactionNotification,
  
  // Relatórios e sumários automáticos
  sendEmailSummary
};
