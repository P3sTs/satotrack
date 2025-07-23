import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface EnhancedButtonProps extends ButtonProps {
  effect?: 'rainbow' | 'neon' | 'glass' | 'shimmer' | 'plastic';
  intensity?: 'subtle' | 'normal' | 'intense';
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  className = '',
  effect = 'neon',
  intensity = 'normal',
  ...props
}) => {
  const getEffectClasses = () => {
    const intensityMap = {
      subtle: '0.7',
      normal: '1',
      intense: '1.3'
    };
    
    const alpha = intensityMap[intensity];

    switch (effect) {
      case 'rainbow':
        return `bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-rainbow transition-all duration-300`;
      
      case 'neon':
        return `bg-satotrack-neon/20 border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon hover:text-black shadow-neon hover:shadow-neon-hover transition-all duration-300`;
      
      case 'glass':
        return `bg-white/10 border-white/20 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300`;
      
      case 'shimmer':
        return `bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-size-200 hover:bg-right-top text-white border-slate-600 transition-all duration-500`;
      
      case 'plastic':
        return `bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200`;
      
      default:
        return '';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Button
        className={cn(
          'relative overflow-hidden',
          getEffectClasses(),
          className
        )}
        {...props}
      >
        {children}
        {effect === 'shimmer' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut'
            }}
          />
        )}
      </Button>
    </motion.div>
  );
};

export default EnhancedButton;