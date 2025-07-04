
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { ValueChangeState } from '@/hooks/useRealtimeData';
import { cn } from '@/lib/utils';

interface DynamicValueProps {
  value: number | null | undefined;
  previousValue?: number | null;
  formatFunc?: (value: number) => string;
  changeState?: ValueChangeState;
  showIcon?: boolean;
  showAnimation?: boolean;
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DynamicValue: React.FC<DynamicValueProps> = ({
  value,
  previousValue,
  formatFunc = (val) => val.toString(),
  changeState: propsChangeState,
  showIcon = true,
  showAnimation = true,
  className = "",
  iconClassName = "",
  size = "md"
}) => {
  const determineChangeState = (): ValueChangeState => {
    if (propsChangeState) return propsChangeState;
    if (value === null || value === undefined) return 'initial';
    if (previousValue === null || previousValue === undefined) return 'initial';
    
    if (value > previousValue) return 'positive';
    if (value < previousValue) return 'negative';
    return 'neutral';
  };
  
  const changeState = determineChangeState();
  const [showFlash, setShowFlash] = useState(false);
  
  useEffect(() => {
    if (showAnimation && (changeState === 'positive' || changeState === 'negative')) {
      setShowFlash(true);
      
      const timer = setTimeout(() => {
        setShowFlash(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [value, changeState, showAnimation]);
  
  const valueClasses = cn(
    "transition-colors duration-300",
    {
      "text-green-500": changeState === 'positive',
      "text-red-500": changeState === 'negative',
    },
    className
  );
  
  const containerClasses = cn(
    "relative transition-all duration-300 rounded-md",
    {
      "animate-fade-in": showFlash,
      "ring-2 ring-green-500": showFlash && changeState === 'positive',
      "ring-2 ring-red-500": showFlash && changeState === 'negative',
    },
    size === 'sm' ? 'text-sm' : '',
    size === 'md' ? 'text-base' : '',
    size === 'lg' ? 'text-lg font-medium' : ''
  );
  
  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-1">
        <span className={valueClasses}>
          {value !== null && value !== undefined
            ? formatFunc(value)
            : "-"}
        </span>
        
        {showIcon && changeState === 'positive' && (
          <ArrowUp 
            className={cn("h-3 w-3 text-green-500", iconClassName)} 
            aria-label="valor aumentou"
          />
        )}
        
        {showIcon && changeState === 'negative' && (
          <ArrowDown 
            className={cn("h-3 w-3 text-red-500", iconClassName)} 
            aria-label="valor diminuiu" 
          />
        )}
      </div>
      
      {showFlash && (
        <div className={cn(
          "absolute inset-0 rounded-md opacity-20",
          changeState === 'positive' ? "bg-green-500" : "bg-red-500",
          "animate-pulse"
        )} />
      )}
    </div>
  );
};
