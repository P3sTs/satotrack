import { SortOption, SortDirection } from '@/types/types';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { 
  loadCarteiras, 
  addCarteira, 
  updateCarteira, 
  loadTransacoes, 
  removeCarteira,
  updateWalletName 
} from '@/services/carteiras';
import { toast } from '@/components/ui/sonner';

/**
 * Load all wallets based on sort options
 */
export const loadUserWallets = async (
  sortOption: SortOption, 
  sortDirection: SortDirection,
  isAuthenticated: boolean
): Promise<CarteiraBTC[]> => {
  if (!isAuthenticated) {
    return [];
  }
  
  try {
    const data = await loadCarteiras(sortOption, sortDirection);
    
    // Ensure tokensData is properly formatted as an array
    const formattedData = data.map(wallet => ({
      ...wallet,
      tokensData: Array.isArray(wallet.tokensData) ? wallet.tokensData : 
                  wallet.tokensData ? [wallet.tokensData] : []
    }));
    
    return formattedData;
  } catch (error) {
    console.error('Error loading wallets:', error);
    return [];
  }
};

/**
 * Add a new wallet
 */
export const addNewWallet = async (
  nome: string, 
  endereco: string, 
  isAuthenticated: boolean
): Promise<CarteiraBTC> => {
  if (!isAuthenticated) {
    throw new Error('Usuário não autenticado');
  }
  
  const newWallet = await addCarteira(nome, endereco);
  
  // Ensure tokensData is properly formatted
  return {
    ...newWallet,
    tokensData: Array.isArray(newWallet.tokensData) ? newWallet.tokensData : 
                newWallet.tokensData ? [newWallet.tokensData] : []
  };
};

/**
 * Update wallet data
 */
export const updateWalletData = async (
  carteira: CarteiraBTC,
  isAuthenticated: boolean
): Promise<CarteiraBTC> => {
  if (!isAuthenticated) {
    throw new Error('Usuário não autenticado');
  }
  
  const updatedWallet = await updateCarteira(carteira);
  
  // Ensure tokensData is properly formatted
  return {
    ...updatedWallet,
    tokensData: Array.isArray(updatedWallet.tokensData) ? updatedWallet.tokensData : 
                updatedWallet.tokensData ? [updatedWallet.tokensData] : []
  };
};

/**
 * Load transactions for a wallet
 */
export const loadWalletTransactions = async (
  walletId: string,
  isAuthenticated: boolean
): Promise<any[]> => {
  if (!isAuthenticated) {
    throw new Error('Usuário não autenticado');
  }
  
  return await loadTransacoes(walletId);
};

/**
 * Remove a wallet
 */
export const removeUserWallet = async (
  id: string,
  isAuthenticated: boolean
): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error('Usuário não autenticado');
  }
  
  await removeCarteira(id);
};

/**
 * Update wallet name
 */
export const updateWalletNameOp = async (
  id: string, 
  nome: string,
  isAuthenticated: boolean
): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error('Usuário não autenticado');
  }
  
  await updateWalletName(id, nome);
};
