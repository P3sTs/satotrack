
import React from 'react';
import ROICalculator from './tools/ROICalculator';
import AchievementsCenter from './tools/AchievementsCenter';
import AIAssistant from './tools/AIAssistant';
import SocialTrading from './tools/SocialTrading';
import CryptoComparator from './tools/CryptoComparator';
import RiskAnalyzer from './tools/RiskAnalyzer';
import OpportunityDetector from './tools/OpportunityDetector';
import TradingSimulator from './tools/TradingSimulator';
import TaxCalculator from './tools/TaxCalculator';

const ImmersiveTools: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Primeira fileira - Ferramentas principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ROICalculator />
        <CryptoComparator />
      </div>
      
      {/* Segunda fileira - Análises avançadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskAnalyzer />
        <OpportunityDetector />
      </div>
      
      {/* Terceira fileira - Simulação e impostos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradingSimulator />
        <TaxCalculator />
      </div>
      
      {/* Quarta fileira - IA e Social */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIAssistant />
        <AchievementsCenter />
        <SocialTrading />
      </div>
    </div>
  );
};

export default ImmersiveTools;
