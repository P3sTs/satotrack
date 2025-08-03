
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface AnimatedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: { 
    opacity: 0, 
    x: -20, 
    scale: 0.98,
    filter: 'blur(4px)' 
  },
  in: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1 
    } 
  },
  out: { 
    opacity: 0, 
    x: 20, 
    scale: 0.98,
    filter: 'blur(4px)',
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  }
};

const childVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 
  },
  in: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] 
    } 
  }
};

export const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className={`min-h-screen ${className}`}
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
      >
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedLayout;
