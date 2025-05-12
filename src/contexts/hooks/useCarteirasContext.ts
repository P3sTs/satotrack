
import { useContext } from 'react';
import { CarteirasContext } from '../CarteirasContext';
import { CarteiraContextType } from '../types/CarteirasTypes';

/**
 * Custom hook to use the carteiras context
 */
export const useCarteiras = (): CarteiraContextType => {
  const context = useContext(CarteirasContext);
  if (!context) {
    throw new Error('useCarteiras deve ser usado dentro de CarteirasProvider');
  }
  return context;
};
