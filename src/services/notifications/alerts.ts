
import { logNotification } from './logger';
import { sendPriceAlert } from './priceAlerts';
import { sendTransactionNotification } from './transactionAlerts';
import { sendIntelligentAlert } from './intelligentAlerts';

// Re-export all notification functions for backward compatibility
export {
  logNotification,
  sendPriceAlert,
  sendTransactionNotification,
  sendIntelligentAlert
};

// Re-export types with explicit 'export type' syntax
export type { PriceAlertDetails } from './priceAlerts';
export type { TransactionAlertDetails } from './transactionAlerts';
export type { IntelligentAlertType, IntelligentAlertDetails } from './intelligentAlerts';
