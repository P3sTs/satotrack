import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  intensity = 'medium',
  onClick
}) => {
  const intensityClasses = {
    light: 'bg-white/5 border-white/10 backdrop-blur-sm',
    medium: 'bg-white/10 border-white/20 backdrop-blur-md',
    heavy: 'bg-white/15 border-white/30 backdrop-blur-lg'
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl border shadow-lg',
        intensityClasses[intensity],
        hoverEffect && 'hover:bg-white/20 hover:border-white/30 transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={hoverEffect ? { 
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0, 255, 198, 0.25)'
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;