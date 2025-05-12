
import { useContext } from 'react';
import { CarteirasContext } from './CarteirasContext';
import { CarteiraContextType } from './types';

/**
 * Custom hook to use the carteiras context
 */
export const useCarteirasContext = (): CarteiraContextType => {
  const context = useContext(CarteirasContext);
  
  if (!context) {
    throw new Error('useCarteirasContext deve ser usado dentro de CarteirasProvider');
  }
  
  return context;
};

