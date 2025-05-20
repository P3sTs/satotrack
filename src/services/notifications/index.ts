
import { checkPushNotificationsSupport, requestPushPermission, sendPushNotification } from './push';
import { sendTelegramNotification } from './telegram';
import { 
  logNotification,
  sendPriceAlert, 
  sendTransactionNotification,
  sendIntelligentAlert,
} from './alerts';
import { sendEmailSummary } from './email';

// Type imports
import type { 
  PriceAlertDetails,
  TransactionAlertDetails,
  IntelligentAlertType
} from './alerts';

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
  
  // Relatórios e sumários automáticos
  sendEmailSummary
};

// Re-export types with explicit type syntax
export type { PriceAlertDetails, TransactionAlertDetails, IntelligentAlertType };
