
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const MarketRiskWarning: React.FC = () => {
  const handleLearnMore = () => {
    // Redirecionar para página educacional ou FAQ
    window.open('/sobre#educacao-bitcoin', '_blank');
  };

  return (
    <Alert className="border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-5 w-5 text-yellow-500" />
      <AlertTitle className="text-yellow-600 dark:text-yellow-400 font-semibold">
        ⚠️ Aviso Importante sobre Riscos
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p className="text-sm">
          O Bitcoin e outras criptomoedas são ativos de <strong>alta volatilidade</strong> e podem sofrer 
          variações extremas de preço em curtos períodos de tempo.
        </p>
        <p className="text-sm">
          <strong>Invista apenas o que você pode perder</strong> e sempre faça sua própria pesquisa 
          antes de tomar decisões de investimento.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLearnMore}
            className="border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/20"
          >
            <Info className="h-3 w-3 mr-1" />
            Saiba Mais sobre Bitcoin
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default MarketRiskWarning;
