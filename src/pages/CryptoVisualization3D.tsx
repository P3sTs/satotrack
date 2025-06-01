
import React from 'react';
import Crypto3DScene from '@/components/3d/Crypto3DScene';

const CryptoVisualization3D: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 left-4 z-50">
        <h1 className="text-2xl font-bold text-satotrack-neon mb-2">
          🌌 Visualização 3D de Carteiras
        </h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Explore carteiras Bitcoin em um ambiente 3D interativo. 
          Digite um endereço Bitcoin para começar a visualização.
        </p>
      </div>
      
      <Crypto3DScene />
    </div>
  );
};

export default CryptoVisualization3D;
