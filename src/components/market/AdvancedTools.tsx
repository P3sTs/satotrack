
import React from 'react';
import BTCConverter from './BTCConverter';
import VariationCalculator from './VariationCalculator';
import VolatilityMeter from './VolatilityMeter';
import DailySummary from './DailySummary';
import SmartInsights from './SmartInsights';

const AdvancedTools: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      <BTCConverter />
      <VariationCalculator />
      <VolatilityMeter />
      <DailySummary />
      <div className="xl:col-span-2">
        <SmartInsights />
      </div>
    </div>
  );
};

export default AdvancedTools;
