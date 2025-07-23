import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dots' | 'bars' | 'ring' | 'pulse' | 'matrix';
  className?: string;
}

export const ModernLoader: React.FC<ModernLoaderProps> = ({
  size = 'md',
  variant = 'dots',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  const dotSize = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={cn('flex space-x-1 justify-center items-center', sizeClasses[size])}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(dotSize[size], 'bg-satotrack-neon rounded-full')}
                animate={{
                  y: [-4, 4, -4],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className={cn('flex space-x-1 justify-center items-end', sizeClasses[size])}>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-satotrack-neon rounded-full"
                animate={{
                  height: [8, 24, 8],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            <motion.div
              className="absolute inset-0 border-2 border-satotrack-neon/20 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-2 border-transparent border-t-satotrack-neon rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={cn('bg-satotrack-neon rounded-full', sizeClasses[size])}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );

      case 'matrix':
        return (
          <div className={cn('grid grid-cols-3 gap-1', sizeClasses[size])}>
            {Array.from({ length: 9 }, (_, i) => (
              <motion.div
                key={i}
                className="bg-satotrack-neon rounded-sm"
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {renderLoader()}
    </div>
  );
};

export default ModernLoader;