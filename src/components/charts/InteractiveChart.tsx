
import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCarteiras } from '@/contexts/CarteirasContext';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import PriceChart from './PriceChart';
import BalanceChart from './BalanceChart';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';

interface InteractiveChartProps {
  bitcoinData?: BitcoinPriceData | null;
  walletId?: string;
}

type TimeRange = '1D' | '7D' | '30D';
type ChartMode = 'balance' | 'price';

const TimeRangeSelector = ({ timeRange, onChange }: { 
  timeRange: TimeRange, 
  onChange: (value: TimeRange) => void 
}) => {
  const handleChange = (value: string) => {
    if (value) {
      onChange(value as TimeRange);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Período</h3>
      <ToggleGroup type="single" value={timeRange} onValueChange={handleChange}>
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
  );
};

const ChartModeSelector = ({ chartMode, onChange, walletId }: { 
  chartMode: ChartMode, 
  onChange: (value: ChartMode) => void,
  walletId?: string
}) => {
  const handleChange = (value: string) => {
    if (value) {
      onChange(value as ChartMode);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Modo de Visualização</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-muted-foreground/70 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs max-w-56">
              Alterne entre visualizar o preço do Bitcoin ou o saldo histórico da sua carteira
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ToggleGroup type="single" value={chartMode} onValueChange={handleChange}>
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
  );
};

const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-dashboard-medium/10 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
      {children}
    </div>
  );
};

const InteractiveChart: React.FC<InteractiveChartProps> = ({ bitcoinData, walletId }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const [chartMode, setChartMode] = useState<ChartMode>('price');
  const { carteiras } = useCarteiras();

  // Get current wallet if walletId is provided
  const currentWallet = walletId 
    ? carteiras.find(c => c.id === walletId) 
    : undefined;

  return (
    <div className="w-full space-y-4 bg-dashboard-dark">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <ChartModeSelector 
          chartMode={chartMode} 
          onChange={setChartMode}
          walletId={walletId} 
        />
        <TimeRangeSelector timeRange={timeRange} onChange={setTimeRange} />
      </div>

      <ChartContainer>
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
    </div>
  );
};

export default InteractiveChart;
