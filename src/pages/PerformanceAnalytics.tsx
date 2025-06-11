
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletPerformanceAnalytics from '@/components/analytics/WalletPerformanceAnalytics';
import RiskVolatilityAnalysis from '@/components/analytics/RiskVolatilityAnalysis';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';

const PerformanceAnalytics = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Análise de Performance Avançada</h1>
        <p className="text-muted-foreground">
          Inteligência artificial aplicada ao monitoramento de carteiras Bitcoin com insights em tempo real.
        </p>
      </div>
      
      <PremiumFeatureGate
        messageTitle="Análise de Performance Premium"
        messageText="Desbloqueie insights avançados de IA, análise de risco e recomendações estratégicas personalizadas."
      >
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Inteligência de Lucros</TabsTrigger>
            <TabsTrigger value="risk">Risco & Volatilidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-6">
            <WalletPerformanceAnalytics />
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-6">
            <RiskVolatilityAnalysis />
          </TabsContent>
        </Tabs>
      </PremiumFeatureGate>
    </div>
  );
};

export default PerformanceAnalytics;
