
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

interface CryptoDashboardAlertsProps {
  isGenerating: boolean;
  generationErrors: string[];
  onRetryGeneration: () => void;
  pendingWalletsCount: number;
}

export const CryptoDashboardAlerts: React.FC<CryptoDashboardAlertsProps> = ({
  isGenerating,
  generationErrors,
  onRetryGeneration,
  pendingWalletsCount
}) => {
  if (isGenerating) {
    return (
      <Alert className="border-blue-500/30 bg-blue-500/10">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <AlertDescription className="text-blue-400">
          <strong>Gerando carteiras via Tatum KMS...</strong><br />
          🔒 Conectando com API segura para criação de endereços únicos
        </AlertDescription>
      </Alert>
    );
  }

  if (generationErrors.length > 0) {
    return (
      <Alert className="border-red-500/30 bg-red-500/10">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-400">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <strong>Erro na geração de carteiras:</strong><br />
              {generationErrors.join(', ')}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetryGeneration}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (pendingWalletsCount > 0) {
    return (
      <Alert className="border-yellow-500/30 bg-yellow-500/10">
        <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
        <AlertDescription className="text-yellow-400">
          <strong>Processamento em andamento:</strong><br />
          {pendingWalletsCount} carteira(s) sendo processada(s) via Tatum KMS
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
