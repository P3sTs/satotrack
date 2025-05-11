
import { useContext } from 'react';
import { CarteirasContext } from './context';
import { CarteirasContextType } from './types';

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
