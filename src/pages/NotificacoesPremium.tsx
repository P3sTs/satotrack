
import React from 'react';
import { useAuth } from '@/contexts/auth';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';
import Notificacoes from './Notificacoes';

const NotificacoesPremium: React.FC = () => {
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';

  if (!isPremium) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PremiumFeatureGate 
          messageTitle="Sistema de Notificações Premium"
          messageText="Configure alertas personalizados por email, Telegram e push notifications para suas carteiras."
          blockType="replace"
        >
          <div className="h-96" />
        </PremiumFeatureGate>
      </div>
    );
  }

  return <Notificacoes />;
};

export default NotificacoesPremium;
