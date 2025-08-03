
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover3D?: boolean;
  glow?: boolean;
  gradient?: boolean;
  interactive?: boolean;
  variant?: 'default' | 'premium' | 'neon' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const variants = {
  default: 'bg-card border-border/50',
  premium: 'bg-gradient-to-br from-card via-card/80 to-background border-primary/20',
  neon: 'bg-card/50 border-neon-green/30 shadow-glow',
  glass: 'bg-white/10 backdrop-blur-xl border-white/20'
};

const sizes = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl'
};

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className = '',
  hover3D = true,
  glow = false,
  gradient = false,
  interactive = false,
  variant = 'default',
  size = 'md',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 3D hover effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const cardClasses = cn(
    'relative border transition-all duration-300 transform-gpu will-change-transform',
    'hover:shadow-card-hover',
    variants[variant],
    sizes[size],
    {
      'cursor-pointer': interactive || onClick,
      'hover:border-primary/40': interactive || onClick,
      'shadow-glow': glow,
      'bg-gradient-mesh': gradient,
    },
    className
  );

  const cardContent = (
    <>
      {/* Gradient overlay for premium variant */}
      {variant === 'premium' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-xl pointer-events-none" />
      )}

      {/* Shimmer effect */}
      {(variant === 'premium' || gradient) && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '200%' : '-100%' }}
          transition={{
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Glow effect */}
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-20 -z-10" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );

  if (hover3D) {
    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        style={{
          rotateY: rotateY,
          rotateX: rotateX,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileHover={interactive ? { scale: 1.02 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={interactive ? { 
        scale: 1.02, 
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {cardContent}
    </motion.div>
  );
};

export default PremiumCard;
