
import React, { useState } from 'react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { useCarteiras } from '@/contexts/CarteirasContext';
import { useAuth } from '@/contexts/auth';
import PriceChart from './PriceChart';
import BalanceChart from './BalanceChart';
import TimeRangeSelector, { TimeRange } from './selectors/TimeRangeSelector';
import ChartModeSelector, { ChartMode } from './selectors/ChartModeSelector';
import ChartContainer from './containers/ChartContainer';
import PremiumChartModal from './modals/PremiumChartModal';
import { ExportCSVButton, ScreenshotButton, useExportActions } from './actions/ExportActions';
import PremiumFeatureGate from '../monetization/PremiumFeatureGate';

interface InteractiveChartProps {
  bitcoinData?: BitcoinPriceData | null;
  walletId?: string;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({ bitcoinData, walletId }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const [chartMode, setChartMode] = useState<ChartMode>('price');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { carteiras } = useCarteiras();
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  const chartRef = React.useRef<HTMLDivElement>(null);

  // Get current wallet if walletId is provided
  const currentWallet = walletId 
    ? carteiras.find(c => c.id === walletId) 
    : undefined;

  const { handleExportCSV, handleScreenshot } = useExportActions(
    chartRef,
    chartMode,
    timeRange,
    currentWallet,
    isPremium
  );
  
  const onExportCSV = () => {
    // For period greater than 30D, show premium modal for non-premium users
    if (!isPremium && (timeRange === '6M' || timeRange === '1Y')) {
      setShowPremiumModal(true);
      return;
    }
    
    handleExportCSV();
  };
  
  // Show extended time ranges for premium users
  const extendedTimeRanges = isPremium 
    ? ['7D', '30D', '90D', '6M', '1Y'] as TimeRange[] 
    : ['24H', '7D'] as TimeRange[];
    
  // Filter time ranges based on premium status
  const availableTimeRanges = extendedTimeRanges.map(range => ({
    value: range,
    label: range,
    disabled: !isPremium && (range === '30D' || range === '90D' || range === '6M' || range === '1Y')
  }));

  return (
    <div className="w-full space-y-4 bg-dashboard-dark">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ChartModeSelector 
            chartMode={chartMode} 
            onChange={setChartMode}
            walletId={walletId} 
          />
          
          <ExportCSVButton onClick={onExportCSV} />
        </div>
        
        <div className="flex items-center gap-3">
          <PremiumFeatureGate
            fallback={
              <TimeRangeSelector 
                timeRange={timeRange} 
                onChange={(range) => {
                  if (!isPremium && (range === '30D' || range === '90D' || range === '6M' || range === '1Y')) {
                    setShowPremiumModal(true);
                    return;
                  }
                  setTimeRange(range);
                }}
                availableRanges={availableTimeRanges.slice(0, 2)}
              />
            }
          >
            <TimeRangeSelector 
              timeRange={timeRange} 
              onChange={setTimeRange}
              availableRanges={availableTimeRanges}
            />
          </PremiumFeatureGate>
          
          <PremiumFeatureGate 
            fallback={
              <ScreenshotButton 
                onClick={() => setShowPremiumModal(true)}
                disabled={!isPremium}
                title="Disponível no Premium"
              />
            }
          >
            <ScreenshotButton onClick={handleScreenshot} />
          </PremiumFeatureGate>
        </div>
      </div>

      <ChartContainer chartRef={chartRef}>
        {chartMode === 'price' ? (
          <PriceChart 
            bitcoinData={bitcoinData} 
            timeRange={timeRange}
          />
        ) : (
          <BalanceChart 
            wallet={currentWallet}
            timeRange={timeRange}
          />
        )}
      </ChartContainer>
      
      <PremiumChartModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal} 
      />
      
      {!isPremium && (
        <div className="flex justify-center mt-2">
          <span className="text-xs text-muted-foreground">
            Acesse gráficos de 30D, 90D e anuais com o{" "}
            <a href="/planos" className="text-bitcoin hover:underline">
              SatoTrack Premium
            </a>
          </span>
        </div>
      )}
    </div>
  );
};

export default InteractiveChart;
