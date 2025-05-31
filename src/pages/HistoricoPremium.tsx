
import React from 'react';
import { useAuth } from '@/contexts/auth';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';
import Historico from './Historico';

const HistoricoPremium: React.FC = () => {
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';

  if (!isPremium) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PremiumFeatureGate 
          messageTitle="Histórico Completo Premium"
          messageText="Acesse o histórico completo de transações, relatórios detalhados e análises históricas avançadas."
          blockType="replace"
        >
          <div className="h-96" />
        </PremiumFeatureGate>
      </div>
    );
  }

  return <Historico />;
};

export default HistoricoPremium;
