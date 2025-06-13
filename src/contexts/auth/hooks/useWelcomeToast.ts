
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { AuthUser, PlanType } from '../types';

export const useWelcomeToast = (
  isAuthenticated: boolean,
  lastActivity: string | null,
  user: AuthUser | null,
  userPlan: PlanType
) => {
  useEffect(() => {
    if (isAuthenticated && user && !lastActivity) {
      // Mostrar toast de boas-vindas apenas para novos usuários
      const welcomeMessage = userPlan === 'premium' 
        ? `🎉 Bem-vindo de volta, ${user.email}! Conta Premium ativa` 
        : `👋 Bem-vindo, ${user.email}! Explore o SatoTracker`;
      
      toast.success(welcomeMessage);
    }
  }, [isAuthenticated, lastActivity, user, userPlan]);
};
