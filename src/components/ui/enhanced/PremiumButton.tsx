
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop' |
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  gradient?: boolean;
  glow?: boolean;
  pulse?: boolean;
  ripple?: boolean;
}

const variants = {
  primary: 'bg-gradient-to-r from-primary to-primary-600 text-primary-foreground hover:from-primary-600 hover:to-primary-700 shadow-glow-blue',
  secondary: 'bg-gradient-to-r from-secondary to-muted text-secondary-foreground hover:from-muted hover:to-secondary',
  success: 'bg-gradient-to-r from-profit to-profit-600 text-white hover:from-profit-600 hover:to-profit shadow-glow',
  warning: 'bg-gradient-to-r from-warning to-warning-600 text-black hover:from-warning-600 hover:to-warning',
  danger: 'bg-gradient-to-r from-loss to-loss-600 text-white hover:from-loss-600 hover:to-loss',
  ghost: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-glow-blue',
  neon: 'bg-transparent border border-neon-green text-neon-green hover:bg-neon-green/10 hover:shadow-glow shadow-glow-lg'
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-xl',
  xl: 'px-10 py-5 text-xl rounded-xl'
};

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  gradient = true,
  glow = false,
  pulse = false,
  ripple = true,
  disabled,
  onClick,
  ...props
}) => {
  const [rippleEffect, setRippleEffect] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRippleEffect(prev => [...prev, { id, x, y }]);
      
      setTimeout(() => {
        setRippleEffect(prev => prev.filter(r => r.id !== id));
      }, 600);
    }

    onClick?.(e);
  };

  const buttonClasses = cn(
    'relative overflow-hidden font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
    'transform-gpu will-change-transform',
    'active:scale-95',
    variants[variant],
    sizes[size],
    {
      'animate-pulse': pulse && !loading,
      'cursor-not-allowed opacity-50': disabled || loading,
      'hover:scale-105': !disabled && !loading,
      'shadow-glow': glow,
    },
    className
  );

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      whileHover={!disabled && !loading ? { scale: 1.05 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      {...props}
    >
      {/* Shimmer effect */}
      {gradient && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Ripple effects */}
      {rippleEffect.map(({ id, x, y }) => (
        <motion.span
          key={id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: x - 10,
            top: y - 10,
            width: 20,
            height: 20,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        
        {!loading && icon && iconPosition === 'left' && icon}
        
        {loading ? loadingText || 'Carregando...' : children}
        
        {!loading && icon && iconPosition === 'right' && icon}
      </span>
    </motion.button>
  );
};

export default PremiumButton;
