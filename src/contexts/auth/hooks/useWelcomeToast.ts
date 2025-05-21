
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { AuthUser, PlanType } from '../types';
import { sendPriceAlert } from '@/services/notifications/alerts';

export const useWelcomeToast = (
  isAuthenticated: boolean,
  lastActivity: number | null,
  user: AuthUser | null,
  userPlan: PlanType
) => {
  // Controle para exibir a mensagem de boas-vindas apenas uma vez por sessão
  const [welcomeToastShown, setWelcomeToastShown] = useState(false);
  const isPremium = userPlan === 'premium';
  
  // Mostrar mensagem de boas-vindas apenas quando o usuário faz login e ainda não mostrou
  useEffect(() => {
    if (isAuthenticated && lastActivity && Date.now() - lastActivity < 3000 && !welcomeToastShown) {
      const displayName = user?.email?.split('@')[0] || 'usuário';
      
      // Atualizar o estado para indicar que o toast foi exibido
      setWelcomeToastShown(true);
      
      // Mostrar toast de boas-vindas
      toast({
        title: `Bem-vindo, ${displayName}!`,
        description: `Você está conectado como ${isPremium ? 'usuário premium' : 'usuário gratuito'}.`,
      });

      // Verificar se há alertas importantes para o usuário
      const checkImportantAlerts = async () => {
        if (user?.id) {
          // Por exemplo, verificar mudanças significativas de preço
          const priceChange = 7.5; // Em um caso real, isso viria de uma API
          if (Math.abs(priceChange) > 5) {
            await sendPriceAlert(
              user.id,
              priceChange,
              65000, // Preço atual do Bitcoin
              isPremium // Incluir análise de IA apenas para usuários premium
            );
          }
        }
      };
      
      if (isPremium) {
        checkImportantAlerts();
      }
    }
  }, [isAuthenticated, lastActivity, user, isPremium, welcomeToastShown]);
};
