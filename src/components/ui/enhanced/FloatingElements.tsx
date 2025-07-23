import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementsProps {
  count?: number;
  className?: string;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 6,
  className = ''
}) => {
  const elements = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elements.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-satotrack-neon/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            scale: 0,
          }}
          animate={{
            y: -50,
            scale: [0, 1, 0],
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;