
import { useContext } from 'react';
import { CarteirasContext } from '../CarteirasContext';
import { CarteirasContextType } from '../types/CarteirasTypes';

/**
 * Custom hook to use the carteiras context
 */
export const useCarteiras = (): CarteirasContextType => {
  const context = useContext(CarteirasContext);
  if (!context) {
    throw new Error('useCarteiras deve ser usado dentro de CarteirasProvider');
  }
  return context;
};
