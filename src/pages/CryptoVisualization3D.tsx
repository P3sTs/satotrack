
import React from 'react';
import Crypto3DScene from '@/components/3d/Crypto3DScene';
import FluidBackground from '@/components/ui/enhanced/FluidBackground';
import FloatingElements from '@/components/ui/enhanced/FloatingElements';
import { motion } from 'framer-motion';

const CryptoVisualization3D: React.FC = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <FluidBackground intensity={1.2} />
      <FloatingElements count={20} />
      
      <motion.div 
        className="absolute top-4 left-4 z-50"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-2xl font-bold text-satotrack-neon mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          🌌 Visualização 3D de Carteiras
        </motion.h1>
        <motion.p 
          className="text-muted-foreground text-sm max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Explore carteiras Bitcoin em um ambiente 3D interativo. 
          Digite um endereço Bitcoin para começar a visualização.
        </motion.p>
      </motion.div>
      
      <Crypto3DScene />
    </div>
  );
};

export default CryptoVisualization3D;
