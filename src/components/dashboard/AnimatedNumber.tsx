import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  showChange?: boolean;
  changeValue?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 500,
  prefix = '',
  suffix = '',
  decimals = 2,
  className,
  showChange = false,
  changeValue = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    
    const startTime = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;

    const animateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = startValue + (difference * easeOutQuart);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animateValue);
  }, [value, duration]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  return (
    <div className="space-y-1">
      <div className={cn(
        "font-bold transition-all duration-300",
        isAnimating && "scale-105",
        className
      )}>
        {prefix}{formatNumber(displayValue)}{suffix}
      </div>
      
      {showChange && changeValue !== undefined && (
        <div className={cn(
          "text-sm font-medium transition-all duration-300",
          getChangeColor(changeValue),
          isAnimating && "scale-105"
        )}>
          {getChangeIcon(changeValue)} {prefix}{Math.abs(changeValue).toFixed(2)}{suffix} 
          ({changeValue > 0 ? '+' : ''}{changeValue.toFixed(2)}%)
        </div>
      )}
    </div>
  );
};