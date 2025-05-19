
import { useContext } from 'react';
import { CarteirasContext } from '../carteiras/CarteirasContext';
import { CarteiraContextType } from '../carteiras/types';

/**
 * Custom hook to access the carteiras context
 */
export const useCarteirasContext = (): CarteiraContextType => {
  const context = useContext(CarteirasContext);
  
  if (!context) {
    throw new Error('useCarteirasContext deve ser usado dentro de um CarteirasProvider');
  }
  
  return context;
};

export default useCarteirasContext;
