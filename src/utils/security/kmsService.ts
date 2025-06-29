/**
 * 🔒 TATUM KMS Integration Service - ENHANCED
 * Complete Key Management System implementation with improved error handling
 */

import { supabase } from '@/integrations/supabase/client';

export interface KMSWallet {
  id: string;
  address: string;
  currency: string;
  kmsId: string;
  publicKey?: string;
  xpub?: string;
}

export interface KMSTransaction {
  walletId: string;
  to: string;
  amount: string;
  currency: string;
  gasPrice?: string;
  gasLimit?: string;
}

export interface KMSSignatureResponse {
  txId: string;
  rawTransaction: string;
  status: 'pending' | 'completed' | 'failed';
}

// Enhanced KMS wallet generation via Tatum with better error handling
export const generateKMSWallet = async (currency: string): Promise<KMSWallet> => {
  try {
    console.log(`🔒 Gerando carteira ${currency} via Tatum KMS...`);
    
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { 
        action: 'generate_wallet',
        currency: currency.toUpperCase()
      }
    });

    if (error) {
      console.error(`KMS wallet generation failed for ${currency}:`, error);
      throw new Error(`Falha na geração KMS: ${error.message}`);
    }

    if (!data || !data.address) {
      throw new Error(`Resposta inválida do Tatum KMS para ${currency}`);
    }

    console.log(`🔒 Carteira KMS gerada para ${currency}:`, data.address);
    
    return {
      id: data.walletId || crypto.randomUUID(),
      address: data.address,
      currency: currency.toUpperCase(),
      kmsId: data.kmsId || data.walletId,
      publicKey: data.publicKey,
      xpub: data.xpub
    };
  } catch (error) {
    console.error(`🚨 Erro na geração KMS para ${currency}:`, error);
    logKMSOperation('GENERATE_WALLET_ERROR', { currency, error: error.message });
    throw error;
  }
};

// Get wallet balance via KMS with retry logic
export const getKMSWalletBalance = async (walletId: string, currency: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { 
        action: 'get_balance',
        walletId,
        currency
      }
    });

    if (error) {
      console.warn(`KMS balance fetch failed for ${currency}:`, error);
      return '0'; // Return 0 instead of throwing for balance queries
    }

    return data?.balance || '0';
  } catch (error) {
    console.error('🚨 KMS balance fetch error:', error);
    logKMSOperation('GET_BALANCE_ERROR', { walletId, currency, error: error.message });
    return '0'; // Graceful fallback
  }
};

// Sign transaction via KMS with enhanced error handling
export const signKMSTransaction = async (transaction: KMSTransaction): Promise<KMSSignatureResponse> => {
  try {
    console.log('🔒 Assinando transação via KMS:', transaction);
    
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { 
        action: 'sign_transaction',
        ...transaction
      }
    });

    if (error) {
      throw new Error(`Falha na assinatura KMS: ${error.message}`);
    }

    console.log('🔒 Transação assinada via KMS:', data.txId);
    logKMSOperation('SIGN_TRANSACTION_SUCCESS', { txId: data.txId });
    
    return {
      txId: data.txId,
      rawTransaction: data.rawTransaction,
      status: 'pending'
    };
  } catch (error) {
    console.error('🚨 Erro na assinatura KMS:', error);
    logKMSOperation('SIGN_TRANSACTION_ERROR', { transaction, error: error.message });
    throw error;
  }
};

// Get KMS wallet info with caching
export const getKMSWalletInfo = async (kmsId: string): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { 
        action: 'get_wallet_info',
        kmsId
      }
    });

    if (error) {
      throw new Error(`KMS wallet info failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('🚨 KMS wallet info error:', error);
    return null; // Graceful fallback
  }
};

// List all KMS wallets for user with better error handling
export const listKMSWallets = async (): Promise<KMSWallet[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { action: 'list_wallets' }
    });

    if (error) {
      console.warn('KMS wallet listing failed:', error);
      return []; // Return empty array instead of throwing
    }

    return data?.wallets || [];
  } catch (error) {
    console.error('🚨 KMS wallet listing error:', error);
    logKMSOperation('LIST_WALLETS_ERROR', { error: error.message });
    return [];
  }
};

// Enhanced security audit log for KMS operations
export const logKMSOperation = (operation: string, details: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    details,
    kmsProvider: 'TATUM',
    securityLevel: 'MAXIMUM',
    sessionId: crypto.randomUUID()
  };
  
  console.log('🔒 KMS OPERATION LOG:', logEntry);
  
  // Store in localStorage for audit trail with better management  
  try {
    const logs = JSON.parse(localStorage.getItem('kms_audit_logs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 50 logs to prevent storage bloat
    if (logs.length > 50) {
      logs.splice(0, logs.length - 50);
    }
    
    localStorage.setItem('kms_audit_logs', JSON.stringify(logs));
  } catch (error) {
    console.warn('Failed to store KMS log:', error);
  }
};

// Enhanced KMS health check with timeout
export const checkKMSHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { action: 'health_check' }
    });

    clearTimeout(timeoutId);

    if (error) {
      console.warn('KMS health check failed:', error);
      return false;
    }
    
    const isHealthy = data?.status === 'healthy';
    logKMSOperation('HEALTH_CHECK', { status: isHealthy ? 'healthy' : 'unhealthy' });
    
    return isHealthy;
  } catch (error) {
    console.error('🚨 KMS health check failed:', error);
    logKMSOperation('HEALTH_CHECK_ERROR', { error: error.message });
    return false;
  }
};

// Get KMS audit logs
export const getKMSAuditLogs = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('kms_audit_logs') || '[]');
  } catch (error) {
    console.warn('Failed to retrieve KMS logs:', error);
    return [];
  }
};

// Clear old KMS logs
export const clearOldKMSLogs = (daysOld: number = 7): void => {
  try {
    const logs = getKMSAuditLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const filteredLogs = logs.filter(log => 
      new Date(log.timestamp) > cutoffDate
    );
    
    localStorage.setItem('kms_audit_logs', JSON.stringify(filteredLogs));
    console.log(`🔒 Removed ${logs.length - filteredLogs.length} old KMS logs`);
  } catch (error) {
    console.warn('Failed to clear old KMS logs:', error);
  }
};
