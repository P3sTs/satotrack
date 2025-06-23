
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, Sparkles } from 'lucide-react';

interface InsightsHeaderProps {
  onGenerateAnalysis: () => void;
  isAnalyzing: boolean;
}

const InsightsHeader: React.FC<InsightsHeaderProps> = ({ onGenerateAnalysis, isAnalyzing }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-satotrack-neon" />
        🔔 Insights Inteligentes
      </div>
      <Button
        onClick={onGenerateAnalysis}
        disabled={isAnalyzing}
        className="bg-satotrack-neon hover:bg-satotrack-neon/80"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analisando...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Análise Avançada IA
          </>
        )}
      </Button>
    </div>
  );
};

export default InsightsHeader;
