
import { useAuth } from '../auth';
import { useCarteirasContext } from './useCarteirasContext';
import { CarteiraContextType } from './types';

/**
 * Custom hook to use the carteiras context with plan-specific enhancements
 */
export const useCarteiras = (): CarteiraContextType => {
  const context = useCarteirasContext();
  const { userPlan } = useAuth();
  
  // Enhance context with plan-specific features
  const enhancedContext: CarteiraContextType = {
    ...context,
    adicionarCarteira: async (nome, endereco) => {
      // Check for wallet limit for free users
      if (userPlan === 'free' && context.carteiras.length >= 1) {
        throw new Error('Usuários do plano gratuito podem adicionar apenas 1 carteira. Faça upgrade para adicionar mais.');
      }
      return context.adicionarCarteira(nome, endereco);
    }
  };

  return enhancedContext;
};

export default useCarteiras;
