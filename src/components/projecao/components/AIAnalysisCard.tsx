
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface AIAnalysisCardProps {
  analysis: string;
}

const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <Card className="bg-gradient-to-r from-satotrack-neon/10 to-blue-900/20 border-satotrack-neon/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-satotrack-neon">
          <Brain className="h-5 w-5" />
          Análise Inteligente das Projeções
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm whitespace-pre-wrap">{analysis}</div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisCard;
