
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type TimeRange = '24H' | '7D' | '30D' | '90D' | '6M' | '1Y';

interface TimeRangeOption {
  value: TimeRange;
  label: string;
  disabled?: boolean;
}

interface TimeRangeSelectorProps {
  timeRange: TimeRange; 
  onChange: (value: TimeRange) => void;
  availableRanges?: TimeRangeOption[];
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ 
  timeRange, 
  onChange,
  availableRanges = [
    { value: '7D', label: '7D' },
    { value: '30D', label: '30D' },
    { value: '6M', label: '6M' },
    { value: '1Y', label: '1Y' }
  ]
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
        {availableRanges.map(range => (
          <ToggleGroupItem 
            key={range.value}
            value={range.value} 
            disabled={range.disabled}
            aria-label={range.label}
            className={`text-xs sm:text-sm data-[state=on]:bg-satotrack-neon/20 data-[state=on]:text-satotrack-neon data-[state=on]:border-satotrack-neon ${
              range.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {range.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default TimeRangeSelector;
