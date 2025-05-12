
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LineChart, BarChart } from "lucide-react";

export type ChartMode = 'price' | 'balance';

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
  
  // If no wallet ID is provided, don't show balance option
  if (!walletId) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Tipo de Gráfico</h3>
      <ToggleGroup type="single" value={chartMode} onValueChange={handleChange}>
        <ToggleGroupItem 
          value="price" 
          aria-label="Preço"
          className="flex items-center gap-1 data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon"
        >
          <LineChart className="h-4 w-4" />
          <span className="hidden sm:inline">Preço</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="balance" 
          aria-label="Saldo"
          className="flex items-center gap-1 data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon"
        >
          <BarChart className="h-4 w-4" />
          <span className="hidden sm:inline">Saldo</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ChartModeSelector;
