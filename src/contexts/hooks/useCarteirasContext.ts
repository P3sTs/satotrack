
import { useContext } from 'react';
import { CarteirasContext } from '../carteiras/CarteirasContext';
import { CarteiraContextType } from '../types/CarteirasTypes';

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

