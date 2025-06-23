
import React from 'react';
import { Brain } from 'lucide-react';

interface AIAnalysisDisplayProps {
  analysis: string;
}

const AIAnalysisDisplay: React.FC<AIAnalysisDisplayProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="mt-6 p-4 rounded-lg bg-satotrack-neon/10 border border-satotrack-neon/30">
      <div className="flex items-center gap-2 text-satotrack-neon mb-3">
        <Brain className="h-5 w-5" />
        <span className="font-semibold">Análise Avançada SatoAI</span>
      </div>
      <div className="text-sm whitespace-pre-wrap">{analysis}</div>
    </div>
  );
};

export default AIAnalysisDisplay;
