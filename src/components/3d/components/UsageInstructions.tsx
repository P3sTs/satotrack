
import React from 'react';

interface UsageInstructionsProps {
  show: boolean;
}

const UsageInstructions: React.FC<UsageInstructionsProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-cyan-500/50 max-w-md text-center">
      <div className="text-cyan-400 font-semibold mb-2">
        🚀 Como usar a Visualização 3D
      </div>
      <div className="text-sm text-gray-300 space-y-1">
        <div>• Digite um endereço Bitcoin válido na busca</div>
        <div>• Clique nas esferas para ver detalhes</div>
        <div>• Arraste para mover as carteiras</div>
        <div>• Use o mouse para rotacionar a cena</div>
      </div>
    </div>
  );
};

export default UsageInstructions;
