import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'grid' | 'dots' | 'lines' | 'mesh';
  intensity?: number;
  speed?: number;
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'grid',
  intensity = 0.5,
  speed = 1,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01 * speed;
      
      const elements = svg.querySelectorAll('.animated-element');
      elements.forEach((element, index) => {
        const offset = Math.sin(time + index * 0.5) * 10;
        element.setAttribute('transform', `translate(${offset}, ${offset * 0.5})`);
        
        const opacity = (Math.sin(time + index * 0.3) + 1) * 0.5 * intensity;
        element.setAttribute('opacity', opacity.toString());
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [speed, intensity]);

  const renderPattern = () => {
    switch (variant) {
      case 'grid':
        return (
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path 
                className="animated-element"
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke="url(#gridGradient)" 
                strokeWidth="1"
                opacity={intensity}
              />
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        );
      
      case 'dots':
        return (
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle 
                className="animated-element"
                cx="10" 
                cy="10" 
                r="1" 
                fill="rgb(0, 255, 198)" 
                opacity={intensity}
              />
            </pattern>
          </defs>
        );
      
      case 'lines':
        return (
          <defs>
            <pattern id="lines" width="60" height="60" patternUnits="userSpaceOnUse">
              <line 
                className="animated-element"
                x1="0" 
                y1="30" 
                x2="60" 
                y2="30" 
                stroke="rgb(59, 130, 246)" 
                strokeWidth="1" 
                opacity={intensity}
              />
            </pattern>
          </defs>
        );
      
      case 'mesh':
        return (
          <defs>
            <pattern id="mesh" width="80" height="80" patternUnits="userSpaceOnUse">
              <path 
                className="animated-element"
                d="M0,0 L80,80 M0,80 L80,0" 
                stroke="rgb(147, 51, 234)" 
                strokeWidth="0.5" 
                opacity={intensity}
              />
            </pattern>
          </defs>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.svg
      ref={svgRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {renderPattern()}
      <rect 
        width="100%" 
        height="100%" 
        fill={`url(#${variant})`} 
      />
    </motion.svg>
  );
};

export default AnimatedBackground;