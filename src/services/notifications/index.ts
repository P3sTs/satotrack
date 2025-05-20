
import { checkPushNotificationsSupport, requestPushPermission, sendPushNotification } from './push';
import { sendTelegramNotification } from './telegram';
import { 
  logNotification,
  sendPriceAlert, 
  sendTransactionNotification,
  sendIntelligentAlert,
  PriceAlertDetails,
  TransactionAlertDetails,
  IntelligentAlertType
} from './alerts';
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
  sendIntelligentAlert,
  
  // Tipos de alertas
  PriceAlertDetails,
  TransactionAlertDetails,
  IntelligentAlertType,
  
  // Relatórios e sumários automáticos
  sendEmailSummary
};
