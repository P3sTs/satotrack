import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  intensity = 1
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const rotateX = mousePosition.y * 15 * intensity;
  const rotateY = mousePosition.x * -15 * intensity;

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'relative group perspective-1000',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="relative w-full h-full transform-gpu"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      >
        {/* Holographic background effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `
              radial-gradient(
                circle at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%,
                rgba(0, 255, 198, 0.3),
                rgba(59, 130, 246, 0.2),
                transparent 70%
              )
            `,
          }}
        />
        
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `
              linear-gradient(
                ${45 + mousePosition.x * 90}deg,
                transparent 30%,
                rgba(255, 255, 255, 0.1) 50%,
                transparent 70%
              )
            `,
          }}
        />

        {/* Main content */}
        <div className="relative z-10 w-full h-full bg-background/80 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-xl">
          {children}
        </div>

        {/* Edge glow */}
        <div className="absolute inset-0 rounded-xl border border-satotrack-neon/20 group-hover:border-satotrack-neon/50 transition-colors duration-300" />
      </motion.div>
    </motion.div>
  );
};

export default HolographicCard;