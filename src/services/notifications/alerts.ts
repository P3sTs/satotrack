
import { logNotification } from './logger';
import { sendPriceAlert, PriceAlertDetails } from './priceAlerts';
import { sendTransactionNotification, TransactionAlertDetails } from './transactionAlerts';
import { sendIntelligentAlert, IntelligentAlertType, IntelligentAlertDetails } from './intelligentAlerts';

// Re-export all notification functions for backward compatibility
export {
  logNotification,
  sendPriceAlert,
  PriceAlertDetails,
  sendTransactionNotification,
  TransactionAlertDetails,
  sendIntelligentAlert,
  IntelligentAlertType,
  IntelligentAlertDetails
};
