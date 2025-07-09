import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  onClick?: () => void;
  tooltip?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'purple' | 'emerald' | 'orange' | 'yellow' | 'neon';
  badge?: string;
  subtitle?: string;
  className?: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    hover: 'hover:bg-blue-500/30'
  },
  purple: {
    bg: 'bg-purple-500/20', 
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    hover: 'hover:bg-purple-500/30'
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400', 
    border: 'border-emerald-500/30',
    hover: 'hover:bg-emerald-500/30'
  },
  orange: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30', 
    hover: 'hover:bg-orange-500/30'
  },
  yellow: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    hover: 'hover:bg-yellow-500/30'
  },
  neon: {
    bg: 'bg-satotrack-neon/20',
    text: 'text-satotrack-neon',
    border: 'border-satotrack-neon/30',
    hover: 'hover:bg-satotrack-neon/30'
  }
};

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  value,
  icon: Icon,
  onClick,
  tooltip,
  trend,
  trendValue,
  color = 'blue',
  badge,
  subtitle,
  className
}) => {
  const colorScheme = colorVariants[color];
  const isClickable = !!onClick;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card 
      className={cn(
        "bg-dashboard-medium/50 border-dashboard-light/30 rounded-2xl transition-all duration-300",
        isClickable && "cursor-pointer hover:scale-105 hover:shadow-lg",
        isClickable && colorScheme.hover,
        className
      )}
      onClick={onClick}
      title={tooltip}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              {badge && (
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full border",
                  colorScheme.text,
                  colorScheme.border,
                  colorScheme.bg
                )}>
                  {badge}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
              
              {trend && trendValue && (
                <div className="flex items-center gap-1">
                  {TrendIcon && (
                    <TrendIcon className={cn(
                      "h-3 w-3",
                      trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    )} />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {trendValue}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              colorScheme.bg
            )}>
              <Icon className={cn("h-6 w-6", colorScheme.text)} />
            </div>
            
            {isClickable && (
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
        
        {isClickable && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full mt-4 text-xs",
              colorScheme.text,
              colorScheme.hover
            )}
          >
            Ver Detalhes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};