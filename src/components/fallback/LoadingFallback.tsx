import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Carregando...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-64', 
    lg: 'h-screen'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center bg-dashboard-dark ${sizeClasses[size]}`}>
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className={`animate-spin text-satotrack-neon ${iconSizes[size]}`} />
        </div>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingFallback;