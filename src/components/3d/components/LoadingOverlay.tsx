
import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-black/80 text-white p-6 rounded-lg border border-cyan-500/50 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400 border-t-transparent mx-auto mb-4"></div>
        <div className="text-cyan-400 font-semibold">Carregando dados da blockchain...</div>
        <div className="text-gray-300 text-sm mt-2">Isso pode levar alguns segundos</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
