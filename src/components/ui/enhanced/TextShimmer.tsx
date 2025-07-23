import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  spread?: number;
}

export const TextShimmer: React.FC<TextShimmerProps> = ({
  children,
  className = '',
  duration = 2,
  spread = 3
}) => {
  return (
    <div className={cn('relative inline-block overflow-hidden', className)}>
      <span className="relative z-10 bg-gradient-to-r from-satotrack-neon via-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {children}
      </span>
      <motion.div
        className="absolute inset-0 -top-0 -bottom-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
        initial={{ x: '-100%', skewX: -15 }}
        animate={{ 
          x: '200%',
          skewX: -15
        }}
        transition={{
          duration: duration,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: spread
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
        }}
      />
    </div>
  );
};

export default TextShimmer;