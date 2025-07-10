import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedNumber } from './AnimatedNumber';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: number;
  change?: number;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  route?: string;
  isLoading?: boolean;
  badge?: string;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  showChange?: boolean;
}

const colorVariants = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
    hover: 'hover:bg-primary/20',
    icon: 'text-primary',
  },
  success: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    hover: 'hover:bg-emerald-500/20',
    icon: 'text-emerald-400',
  },
  warning: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    hover: 'hover:bg-amber-500/20',
    icon: 'text-amber-400',
  },
  info: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    hover: 'hover:bg-blue-500/20',
    icon: 'text-blue-400',
  },
  danger: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    hover: 'hover:bg-red-500/20',
    icon: 'text-red-400',
  },
};

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  route,
  isLoading = false,
  badge,
  subtitle,
  prefix = '',
  suffix = '',
  decimals = 0,
  showChange = false,
}) => {
  const navigate = useNavigate();
  const colors = colorVariants[color];

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer",
        colors.bg,
        colors.border,
        colors.hover,
        "hover:scale-105 hover:shadow-lg",
        route && "hover:shadow-xl"
      )}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {badge && (
            <Badge variant="outline" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <Icon className={cn("h-4 w-4", colors.icon)} />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-1">
          <AnimatedNumber
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            showChange={showChange}
            changeValue={change}
            className={cn("text-2xl font-bold", colors.text)}
          />
          
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        
        {route && (
          <div className="absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-r from-transparent to-primary transition-opacity duration-300" />
        )}
      </CardContent>
    </Card>
  );
};