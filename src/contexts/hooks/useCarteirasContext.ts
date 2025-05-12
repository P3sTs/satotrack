
import { useContext } from 'react';
import { CarteirasContext } from '../CarteirasContext';
import { CarteiraContextType } from '../types/CarteirasTypes';
import { useAuth } from '../auth';

/**
 * Custom hook to use the carteiras context
 */
export const useCarteiras = (): CarteiraContextType => {
  const context = useContext(CarteirasContext);
  const { userPlan } = useAuth();
  
  if (!context) {
    throw new Error('useCarteiras deve ser usado dentro de CarteirasProvider');
  }
  
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
