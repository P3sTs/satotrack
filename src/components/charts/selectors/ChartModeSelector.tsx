
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ChartMode = 'balance' | 'price';

interface ChartModeSelectorProps {
  chartMode: ChartMode;
  onChange: (value: ChartMode) => void;
  walletId?: string;
}

const ChartModeSelector: React.FC<ChartModeSelectorProps> = ({ 
  chartMode, 
  onChange,
  walletId 
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

export default ChartModeSelector;
