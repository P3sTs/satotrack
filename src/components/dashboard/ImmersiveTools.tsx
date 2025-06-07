
import React from 'react';
import ROICalculator from './tools/ROICalculator';
import AchievementsCenter from './tools/AchievementsCenter';
import AIAssistant from './tools/AIAssistant';
import SocialTrading from './tools/SocialTrading';

const ImmersiveTools: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ROICalculator />
      <AchievementsCenter />
      <AIAssistant />
      <SocialTrading />
    </div>
  );
};

export default ImmersiveTools;
