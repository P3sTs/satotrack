import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = '',
  direction = 'up'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const getTransform = () => {
    const distance = 100 * speed;
    
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
      default:
        return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
    }
  };

  const transform = getTransform();

  const style = direction === 'left' || direction === 'right' 
    ? { x: transform }
    : { y: transform };

  return (
    <div ref={ref} className={className}>
      <motion.div style={style}>
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;