
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type TimeRange = '7D' | '30D' | '6M' | '1Y';

interface TimeRangeSelectorProps {
  timeRange: TimeRange; 
  onChange: (value: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ 
  timeRange, 
  onChange 
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

export default TimeRangeSelector;
