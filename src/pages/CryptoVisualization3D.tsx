
import React from 'react';
import Crypto3DScene from '@/components/3d/Crypto3DScene';

const CryptoVisualization3D: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 left-4 z-50">
        <h1 className="text-2xl font-bold text-satotrack-neon mb-2">
          🌌 Crypto Visualization 3D
        </h1>
        <p className="text-muted-foreground text-sm">
          Explore carteiras cripto em um ambiente 3D interativo
        </p>
      </div>
      
      <Crypto3DScene />
    </div>
  );
};

export default CryptoVisualization3D;
