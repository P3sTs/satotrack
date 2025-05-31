
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { PremiumFeatureGate } from '@/components/monetization/PremiumFeatureGate';
import ProjecaoLucros from './ProjecaoLucros';

const ProjecaoLucrosPremium: React.FC = () => {
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';

  if (!isPremium) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PremiumFeatureGate 
          messageTitle="Projeções de Lucros Premium"
          messageText="Acesse análises avançadas de projeção de lucros, simulações de cenários e insights exclusivos."
          blockType="replace"
        >
          <div className="h-96" />
        </PremiumFeatureGate>
      </div>
    );
  }

  return <ProjecaoLucros />;
};

export default ProjecaoLucrosPremium;
