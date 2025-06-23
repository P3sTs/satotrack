
import React from 'react';
import { Brain } from 'lucide-react';

const EmptyInsightsState: React.FC = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>Aguardando dados suficientes para análise...</p>
    </div>
  );
};

export default EmptyInsightsState;
