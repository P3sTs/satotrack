import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TrustWalletCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'crypto' | 'stats';
}

export const TrustWalletCard: React.FC<TrustWalletCardProps> = ({
  children,
  className,
  variant = 'default'
}) => {
  return (
    <Card className={cn(
      "rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:scale-[1.02]",
      variant === 'crypto' && "bg-gradient-to-br from-card/90 to-card/60",
      variant === 'stats' && "bg-gradient-to-r from-primary/5 to-secondary/5",
      variant === 'default' && "bg-card/80",
      className
    )}>
      {children}
    </Card>
  );
};

interface CryptoCardContentProps {
  icon: string | React.ReactNode;
  name: string;
  symbol?: string;
  balance: string;
  balanceUSD?: string;
  change?: number;
  onClick?: () => void;
}

export const CryptoCardContent: React.FC<CryptoCardContentProps> = ({
  icon,
  name,
  symbol,
  balance,
  balanceUSD,
  change,
  onClick
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <CardContent className="p-4" onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {typeof icon === 'string' ? (
            <img src={icon} alt={name} className="h-10 w-10 rounded-full" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            {symbol && (
              <p className="text-sm text-muted-foreground">{symbol}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-2xl font-bold text-foreground">{balance}</h4>
        
        <div className="flex items-center justify-between">
          {balanceUSD && (
            <p className="text-sm text-muted-foreground">{balanceUSD}</p>
          )}
          
          {change !== undefined && (
            <span className={cn(
              "text-sm font-medium",
              isPositive && "text-green-400",
              isNegative && "text-red-400",
              change === 0 && "text-muted-foreground"
            )}>
              {isPositive && '+'}
              {change.toFixed(2)}%
            </span>
          )}
        </div>
      </div>
    </CardContent>
  );
};

interface StatsCardContentProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const StatsCardContent: React.FC<StatsCardContentProps> = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  trendValue
}) => {
  return (
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trendValue && (
            <p className={cn(
              "text-sm font-medium mt-2",
              trend === 'up' && "text-green-400",
              trend === 'down' && "text-red-400",
              trend === 'neutral' && "text-muted-foreground"
            )}>
              {trend === 'up' && '↗️'} 
              {trend === 'down' && '↘️'} 
              {trendValue}
            </p>
          )}
        </div>
        <div className="text-primary/70 ml-4">
          {icon}
        </div>
      </div>
    </CardContent>
  );
};