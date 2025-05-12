
import { useCarteiras } from '../carteiras/useCarteiras';
import { CarteiraContextType } from '../types/CarteirasTypes';

/**
 * Custom hook to use the carteiras context
 */
export const useCarteiras = (): CarteiraContextType => {
  return useCarteiras();
};

export default useCarteiras;
