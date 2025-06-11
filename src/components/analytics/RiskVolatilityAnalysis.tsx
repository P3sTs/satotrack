
import React, { useState, useEffect } from 'react';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { RiskMetrics } from './types/riskTypes';
import { calculateRiskMetrics, generateBalanceVariationData } from './utils/riskCalculations';
import RiskMetricsHeader from './components/RiskMetricsHeader';
import BalanceVariationChart from './components/BalanceVariationChart';
import WalletRiskAnalysis from './components/WalletRiskAnalysis';
import RiskRecommendations from './components/RiskRecommendations';

const RiskVolatilityAnalysis: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics[]>([]);
  const [networkFeeRate, setNetworkFeeRate] = useState(25); // sat/vB simulado
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '48h' | '7d'>('48h');

  useEffect(() => {
    const metrics = calculateRiskMetrics(carteiras, networkFeeRate);
    setRiskMetrics(metrics);
  }, [carteiras, selectedTimeframe, networkFeeRate]);

  const balanceData = generateBalanceVariationData(selectedTimeframe);
  const averageRisk = riskMetrics.reduce((acc, metric) => acc + metric.volatilityScore, 0) / riskMetrics.length || 0;
  const totalAlerts = riskMetrics.reduce((acc, metric) => acc + metric.alerts.length, 0);

  return (
    <div className="space-y-6">
      <RiskMetricsHeader
        averageRisk={averageRisk}
        networkFeeRate={networkFeeRate}
        totalAlerts={totalAlerts}
        selectedTimeframe={selectedTimeframe}
      />

      <BalanceVariationChart
        balanceData={balanceData}
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
      />

      <WalletRiskAnalysis riskMetrics={riskMetrics} />

      <RiskRecommendations />
    </div>
  );
};

export default RiskVolatilityAnalysis;
