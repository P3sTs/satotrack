
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'avatar' | 'chart' | 'table' | 'dashboard';
  className?: string;
  lines?: number;
  animate?: boolean;
}

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("card-premium p-6 space-y-4", className)}>
    <div className="skeleton h-6 w-1/2"></div>
    <div className="skeleton h-4 w-3/4"></div>
    <div className="skeleton h-4 w-1/2"></div>
    <div className="skeleton h-12 w-full"></div>
  </div>
);

const SkeletonChart: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("card-premium p-6", className)}>
    <div className="skeleton h-6 w-1/3 mb-4"></div>
    <div className="h-64 bg-muted/20 rounded-lg flex items-end justify-around p-4 space-x-2">
      {[...Array(7)].map((_, i) => (
        <div 
          key={i} 
          className="skeleton flex-1 animate-skeleton-loading"
          style={{ 
            height: `${Math.random() * 60 + 40}%`,
            animationDelay: `${i * 0.1}s` 
          }}
        ></div>
      ))}
    </div>
  </div>
);

const SkeletonTable: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("card-premium", className)}>
    <div className="p-4 border-b border-border/50">
      <div className="skeleton h-6 w-1/4"></div>
    </div>
    <div className="p-4 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="skeleton-avatar"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/2"></div>
            <div className="skeleton h-3 w-1/4"></div>
          </div>
          <div className="skeleton h-6 w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonDashboard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-6", className)}>
    {/* Header */}
    <div className="skeleton h-12 w-full"></div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
    
    {/* Chart Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonChart />
      <SkeletonTable />
    </div>
  </div>
);

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  className = '',
  lines = 3,
  animate = true
}) => {
  const baseClasses = cn(
    'animate-skeleton-loading',
    { 'animate-none': !animate },
    className
  );

  switch (variant) {
    case 'card':
      return <SkeletonCard className={baseClasses} />;
      
    case 'chart':
      return <SkeletonChart className={baseClasses} />;
      
    case 'table':
      return <SkeletonTable className={baseClasses} />;
      
    case 'dashboard':
      return <SkeletonDashboard className={baseClasses} />;
      
    case 'avatar':
      return <div className={cn('skeleton-avatar', baseClasses)} />;
      
    case 'text':
    default:
      return (
        <div className="space-y-2">
          {[...Array(lines)].map((_, i) => (
            <div 
              key={i} 
              className={cn('skeleton-text', baseClasses)}
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      );
  }
};

export default SkeletonLoader;
