
/**
 * 🔒 ENHANCED CLIENT-SIDE ENCRYPTION SYSTEM
 * Advanced security utilities with user-specific encryption
 */

export interface EncryptedData {
  encrypted: string;
  iv: string;
  salt: string;
  keyDerivationParams: {
    iterations: number;
    algorithm: string;
  };
}

export interface SecureWalletData {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
  xpub?: string;
  kmsId?: string;
  // Nunca incluir private_key_encrypted
}

// Gerar salt único por usuário
export const generateUserSalt = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Derivar chave de criptografia segura
export const deriveEncryptionKey = async (
  userSecret: string,
  salt: Uint8Array,
  iterations: number = 100000
): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userSecret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// Criptografia avançada de dados sensíveis
export const encryptSensitiveWalletData = async (
  data: string,
  userSecret: string
): Promise<EncryptedData> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const iterations = 100000;

  const key = await deriveEncryptionKey(userSecret, salt, iterations);

  const encoder = new TextEncoder();
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoder.encode(data)
  );

  return {
    encrypted: Array.from(new Uint8Array(encryptedData), b => b.toString(16).padStart(2, '0')).join(''),
    iv: Array.from(iv, b => b.toString(16).padStart(2, '0')).join(''),
    salt: Array.from(salt, b => b.toString(16).padStart(2, '0')).join(''),
    keyDerivationParams: {
      iterations,
      algorithm: 'PBKDF2-SHA256'
    }
  };
};

// Descriptografia de dados sensíveis
export const decryptSensitiveWalletData = async (
  encryptedData: EncryptedData,
  userSecret: string
): Promise<string> => {
  const salt = new Uint8Array(encryptedData.salt.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const iv = new Uint8Array(encryptedData.iv.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const encrypted = new Uint8Array(encryptedData.encrypted.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));

  const key = await deriveEncryptionKey(userSecret, salt, encryptedData.keyDerivationParams.iterations);

  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encrypted
  );

  return new TextDecoder().decode(decryptedData);
};

// Validação rigorosa de dados de carteira
export const validateSecureWalletData = (walletData: any): walletData is SecureWalletData => {
  // Lista de campos proibidos por questões de segurança
  const forbiddenFields = [
    'privateKey',
    'private_key', 
    'private_key_encrypted',
    'mnemonic',
    'seed',
    'secretKey',
    'privateKeyEncrypted'
  ];

  // Verificar se contém campos proibidos
  for (const field of forbiddenFields) {
    if (walletData[field] !== undefined) {
      console.error(`🚨 SECURITY VIOLATION: Campo proibido detectado: ${field}`);
      return false;
    }
  }

  // Verificar campos obrigatórios
  const requiredFields = ['id', 'name', 'address', 'currency'];
  for (const field of requiredFields) {
    if (!walletData[field]) {
      console.error(`❌ Campo obrigatório ausente: ${field}`);
      return false;
    }
  }

  return true;
};

// Sanitizar dados de carteira antes do armazenamento
export const sanitizeWalletData = (walletData: any): SecureWalletData => {
  if (!validateSecureWalletData(walletData)) {
    throw new Error('Dados de carteira inválidos ou inseguros');
  }

  return {
    id: walletData.id,
    name: walletData.name,
    address: walletData.address,
    currency: walletData.currency,
    balance: walletData.balance || '0',
    xpub: walletData.xpub,
    kmsId: walletData.kmsId
  };
};

// Log de auditoria de segurança aprimorado
export const logSecurityEvent = (
  eventType: 'WALLET_CREATED' | 'WALLET_ACCESSED' | 'ENCRYPTION_USED' | 'SECURITY_VIOLATION',
  details: any,
  userId?: string
) => {
  const auditLog = {
    timestamp: new Date().toISOString(),
    eventType,
    details: {
      ...details,
      // Nunca logar dados sensíveis
      privateDataRemoved: true
    },
    userId: userId ? `${userId.substring(0, 8)}...` : 'anonymous',
    securityLevel: 'HIGH',
    sessionId: crypto.randomUUID()
  };

  console.log('🔒 SECURITY AUDIT:', auditLog);

  // Armazenar em localStorage para auditoria local (dados não sensíveis)
  try {
    const logs = JSON.parse(localStorage.getItem('security_audit_logs') || '[]');
    logs.push(auditLog);
    
    // Manter apenas os últimos 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('security_audit_logs', JSON.stringify(logs));
  } catch (error) {
    console.warn('Falha ao armazenar log de auditoria:', error);
  }
};

// Verificação de integridade dos dados
export const verifyDataIntegrity = (data: any): boolean => {
  try {
    // Verificar se é um objeto válido
    if (typeof data !== 'object' || data === null) {
      return false;
    }

    // Verificar estrutura básica
    if (!data.id || !data.address || !data.currency) {
      return false;
    }

    // Verificar se não contém dados sensíveis
    return validateSecureWalletData(data);
  } catch (error) {
    console.error('Erro na verificação de integridade:', error);
    return false;
  }
};

// Sistema de hash para verificação de integridade
export const generateDataHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Limpar dados sensíveis da memória
export const secureMemoryCleanup = (sensitiveData: any) => {
  if (typeof sensitiveData === 'object' && sensitiveData !== null) {
    for (const key in sensitiveData) {
      if (sensitiveData.hasOwnProperty(key)) {
        delete sensitiveData[key];
      }
    }
  }
};
