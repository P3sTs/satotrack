
/**
 * Crypto-specific security utilities
 * IMPORTANT: This is a basic implementation. In production, use proper HSM or KMS.
 */

// Basic encryption for demonstration (DO NOT USE IN PRODUCTION)
export const encryptPrivateKey = async (privateKey: string, userSalt: string): Promise<string> => {
  // WARNING: This is a simplified example. In production:
  // 1. Use proper KMS (AWS KMS, Azure Key Vault, etc.)
  // 2. Use hardware security modules (HSM)
  // 3. Never store keys in the database directly
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(privateKey + userSalt);
    
    // Generate a key for encryption
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(userSalt.substring(0, 32).padEnd(32, '0')),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt private key');
  }
};

// Basic decryption for demonstration (DO NOT USE IN PRODUCTION)
export const decryptPrivateKey = async (encryptedKey: string, userSalt: string): Promise<string> => {
  try {
    const combined = new Uint8Array(
      atob(encryptedKey).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(userSalt.substring(0, 32).padEnd(32, '0')),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decrypted);
    
    // Remove the salt suffix
    return decryptedText.replace(userSalt, '');
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt private key');
  }
};

// Secure private key storage indicator
export const isPrivateKeySecure = (encryptedKey: string): boolean => {
  // Check if it's not just base64 encoded (old insecure method)
  try {
    const decoded = atob(encryptedKey);
    // If it's just base64 of a hex string, it's not secure
    return !/^[a-fA-F0-9]{64}$/.test(decoded);
  } catch {
    return true; // If it can't be decoded as base64, assume it's properly encrypted
  }
};

// Generate secure user salt
export const generateUserSalt = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
