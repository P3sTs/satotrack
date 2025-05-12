
import { STORAGE_KEY_PRIMARY } from '../types';

/**
 * Get primary wallet ID from storage
 */
export const getPrimaryWalletFromStorage = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_PRIMARY);
};

/**
 * Set primary wallet ID in storage
 */
export const setPrimaryWalletInStorage = (id: string | null): void => {
  if (id) {
    localStorage.setItem(STORAGE_KEY_PRIMARY, id);
  } else {
    localStorage.removeItem(STORAGE_KEY_PRIMARY);
  }
};

