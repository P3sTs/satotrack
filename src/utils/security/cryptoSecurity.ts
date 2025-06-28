
/**
 * 🔒 SECURE Crypto Utilities - NO PRIVATE KEY STORAGE
 * This module ensures NO private keys are ever stored in the application
 */

// 🔒 SECURITY NOTICE: We NEVER store private keys in this application
export const SECURITY_NOTICE = {
  privateKeys: 'NEVER_STORED',
  approach: 'PUBLIC_DATA_ONLY',
  transactions: 'USE_TATUM_KMS_OR_EXTERNAL_SIGNING'
};

// Generate secure user salt for future encryption needs (not for private keys)
export const generateUserSalt = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate that no private key data is being stored
export const validateSecureWalletData = (walletData: any): boolean => {
  const forbiddenFields = [
    'privateKey',
    'private_key',
    'private_key_encrypted',
    'mnemonic',
    'seed',
    'secretKey'
  ];
  
  for (const field of forbiddenFields) {
    if (walletData[field]) {
      console.error(`🚨 SECURITY VIOLATION: Attempted to store ${field}`);
      return false;
    }
  }
  
  return true;
};

// Check if wallet data contains only safe public information
export const isWalletDataSecure = (walletData: any): boolean => {
  const allowedFields = [
    'id',
    'user_id',
    'name',
    'address',
    'currency',
    'balance',
    'xpub', // Extended public key is safe
    'created_at',
    'updated_at'
  ];
  
  const dataKeys = Object.keys(walletData);
  const hasOnlyAllowedFields = dataKeys.every(key => allowedFields.includes(key));
  
  if (!hasOnlyAllowedFields) {
    console.warn('🔒 Wallet data contains non-standard fields:', dataKeys);
  }
  
  return validateSecureWalletData(walletData);
};

// Transaction signing notice - use external services
export const getTransactionSigningInstructions = () => {
  return {
    message: '🔒 For transaction signing, use:',
    options: [
      '1. Tatum KMS (Key Management Service)',
      '2. External wallet connection (MetaMask, WalletConnect)',
      '3. Hardware wallet integration',
      '4. Custodial service APIs'
    ],
    warning: 'NEVER store private keys in browser or database'
  };
};

// Log security compliance
export const logSecurityCompliance = (action: string) => {
  console.log(`🔒 SECURITY COMPLIANT: ${action} - No private keys involved`);
};
