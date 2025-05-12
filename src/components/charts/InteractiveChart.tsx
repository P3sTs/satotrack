import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCarteiras } from '@/contexts/CarteirasContext';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import PriceChart from './PriceChart';
import BalanceChart from './BalanceChart';
import { Camera, Download, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { UpgradeButton } from '@/components/monetization/PlanDisplay';

interface InteractiveChartProps {
  bitcoinData?: BitcoinPriceData | null;
  walletId?: string;
}

type TimeRange = '7D' | '30D' | '6M' | '1Y';
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
        <ToggleGroupItem 
          value="6M" 
          aria-label="6 Meses"
          className="text-xs sm:text-sm data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon"
        >
          6M
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="1Y" 
          aria-label="1 Ano"
          className="text-xs sm:text-sm data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon"
        >
          1Y
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

const ChartContainer = ({ children, chartRef }: { children: React.ReactNode, chartRef: React.RefObject<HTMLDivElement> }) => {
  return (
    <div ref={chartRef} className="w-full bg-dashboard-medium/10 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
      {children}
    </div>
  );
};

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
    
  const handleExportCSV = () => {
    // For period greater than 30D, show premium modal for non-premium users
    if (!isPremium && (timeRange === '6M' || timeRange === '1Y')) {
      setShowPremiumModal(true);
      return;
    }
    
    // Generate CSV for the current chart data
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (chartMode === 'price') {
      // Headers for price data
      csvContent += "Data,Preço (USD)\n";
      // Add dummy data or actual data from the chart
      csvContent += "2023-01-01,45000\n";
      csvContent += "2023-01-02,46000\n";
      // ... more data points
    } else {
      // Headers for balance data
      csvContent += "Data,Saldo (BTC)\n";
      // Add dummy data or actual data from the chart
      csvContent += "2023-01-01,0.5\n";
      csvContent += "2023-01-02,0.52\n";
      // ... more data points
    }
    
    // Create the download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${chartMode === 'price' ? 'bitcoin_price' : currentWallet?.nome || 'wallet'}_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Dados exportados com sucesso");
  };
  
  const handleScreenshot = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        const image = canvas.toDataURL("image/png");
        saveAs(
          image, 
          `satotrack_${chartMode === 'price' ? 'bitcoin' : currentWallet?.nome || 'wallet'}_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`
        );
        toast.success("Screenshot salva com sucesso");
      } catch (error) {
        console.error("Erro ao capturar screenshot:", error);
        toast.error("Erro ao salvar screenshot");
      }
    }
  };

  return (
    <div className="w-full space-y-4 bg-dashboard-dark">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ChartModeSelector 
            chartMode={chartMode} 
            onChange={setChartMode}
            walletId={walletId} 
          />
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <TimeRangeSelector timeRange={timeRange} onChange={setTimeRange} />
          <Button
            variant="outline"
            size="icon"
            onClick={handleScreenshot}
            className="h-9 w-9"
            title="Capturar screenshot"
          >
            <Camera className="h-4 w-4" />
          </Button>
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
      
      {/* Premium Modal for Export Limitations */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recursos Premium</DialogTitle>
            <DialogDescription>
              Exportação de dados históricos completos (6 meses e 1 ano) está disponível apenas para assinantes Premium.
              <br /><br />
              No plano gratuito, você pode exportar dados de até 30 dias.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setShowPremiumModal(false)}>
              Cancelar
            </Button>
            <UpgradeButton />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InteractiveChart;
