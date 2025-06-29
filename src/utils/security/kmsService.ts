/**
 * 🔒 TATUM KMS Integration Service
 * Complete Key Management System implementation
 */

import { supabase } from '@/integrations/supabase/client';

export interface KMSWallet {
  id: string;
  address: string;
  currency: string;
  kmsId: string;
  publicKey?: string;
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

// KMS wallet generation via Tatum
export const generateKMSWallet = async (currency: string): Promise<KMSWallet> => {
  try {
    console.log(`🔒 Generating ${currency} wallet via Tatum KMS...`);
    
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { 
        action: 'generate_wallet',
        currency: currency.toUpperCase()
      }
    });

    if (error) {
      throw new Error(`KMS wallet generation failed: ${error.message}`);
    }

    console.log(`🔒 KMS wallet generated for ${currency}:`, data.address);
    
    return {
      id: data.walletId,
      address: data.address,
      currency: currency.toUpperCase(),
      kmsId: data.kmsId,
      publicKey: data.publicKey
    };
  } catch (error) {
    console.error(`🚨 KMS wallet generation error for ${currency}:`, error);
    throw error;
  }
};

// Get wallet balance via KMS
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
      throw new Error(`KMS balance fetch failed: ${error.message}`);
    }

    return data.balance || '0';
  } catch (error) {
    console.error('🚨 KMS balance fetch error:', error);
    throw error;
  }
};

// Sign transaction via KMS
export const signKMSTransaction = async (transaction: KMSTransaction): Promise<KMSSignatureResponse> => {
  try {
    console.log('🔒 Signing transaction via KMS:', transaction);
    
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { 
        action: 'sign_transaction',
        ...transaction
      }
    });

    if (error) {
      throw new Error(`KMS transaction signing failed: ${error.message}`);
    }

    console.log('🔒 Transaction signed via KMS:', data.txId);
    
    return {
      txId: data.txId,
      rawTransaction: data.rawTransaction,
      status: 'pending'
    };
  } catch (error) {
    console.error('🚨 KMS transaction signing error:', error);
    throw error;
  }
};

// Get KMS wallet info
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
    throw error;
  }
};

// List all KMS wallets for user
export const listKMSWallets = async (): Promise<KMSWallet[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { action: 'list_wallets' }
    });

    if (error) {
      throw new Error(`KMS wallet listing failed: ${error.message}`);
    }

    return data.wallets || [];
  } catch (error) {
    console.error('🚨 KMS wallet listing error:', error);
    return [];
  }
};

// Security audit log for KMS operations
export const logKMSOperation = (operation: string, details: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    details,
    kmsProvider: 'TATUM',
    securityLevel: 'MAXIMUM'
  };
  
  console.log('🔒 KMS OPERATION LOG:', logEntry);
  
  // Store in localStorage for audit trail
  const logs = JSON.parse(localStorage.getItem('kms_audit_logs') || '[]');
  logs.push(logEntry);
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.splice(0, logs.length - 100);
  }
  
  localStorage.setItem('kms_audit_logs', JSON.stringify(logs));
};

// KMS health check
export const checkKMSHealth = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('tatum-kms-wallet', {
      body: { action: 'health_check' }
    });

    if (error) return false;
    
    return data.status === 'healthy';
  } catch (error) {
    console.error('🚨 KMS health check failed:', error);
    return false;
  }
};
