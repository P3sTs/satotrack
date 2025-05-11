
import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCarteiras } from '@/contexts/CarteirasContext';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import PriceChart from './PriceChart';
import BalanceChart from './BalanceChart';

interface InteractiveChartProps {
  bitcoinData?: BitcoinPriceData | null;
  walletId?: string;
}

type TimeRange = '1D' | '7D' | '30D';
type ChartMode = 'balance' | 'price';

const InteractiveChart: React.FC<InteractiveChartProps> = ({ bitcoinData, walletId }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const [chartMode, setChartMode] = useState<ChartMode>('price');
  const { carteiras } = useCarteiras();

  // Get current wallet if walletId is provided
  const currentWallet = walletId 
    ? carteiras.find(c => c.id === walletId) 
    : undefined;

  const handleTimeRangeChange = (value: string) => {
    if (value) {
      setTimeRange(value as TimeRange);
    }
  };

  const handleChartModeChange = (value: string) => {
    if (value) {
      setChartMode(value as ChartMode);
    }
  };

  return (
    <div className="w-full space-y-4 bg-dashboard-dark">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Modo de Visualização</h3>
          <ToggleGroup type="single" value={chartMode} onValueChange={handleChartModeChange}>
            <ToggleGroupItem 
              value="price" 
              aria-label="Preço Bitcoin"
              className="text-xs sm:text-sm data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon"
            >
              Preço Bitcoin
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="balance" 
              aria-label="Saldo da Carteira"
              disabled={!walletId}
              className="text-xs sm:text-sm data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon"
            >
              Saldo da Carteira
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Período</h3>
          <ToggleGroup type="single" value={timeRange} onValueChange={handleTimeRangeChange}>
            <ToggleGroupItem 
              value="1D" 
              aria-label="1 Dia"
              className="text-xs sm:text-sm data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon"
            >
              1D
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="7D" 
              aria-label="7 Dias"
              className="text-xs sm:text-sm data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon"
            >
              7D
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="30D" 
              aria-label="30 Dias"
              className="text-xs sm:text-sm data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon"
            >
              30D
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="w-full bg-dashboard-medium/10 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
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
      </div>
    </div>
  );
};

export default InteractiveChart;
