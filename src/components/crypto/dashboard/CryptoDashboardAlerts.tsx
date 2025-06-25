
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

interface CryptoDashboardAlertsProps {
  generationStatus: GenerationStatus;
  generationErrors: string[];
  onRetryGeneration: () => void;
  pendingWalletsCount: number;
}

export const CryptoDashboardAlerts: React.FC<CryptoDashboardAlertsProps> = ({
  generationStatus,
  generationErrors,
  onRetryGeneration,
  pendingWalletsCount
}) => {
  return (
    <>
      {generationStatus === 'generating' && (
        <Alert className="border-blue-500/30 bg-blue-500/10">
          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          <AlertDescription className="text-blue-600">
            <strong>Gerando carteiras...</strong> Conectando com a API Tatum para criar seus endereços Web3.
            Este processo pode levar alguns segundos.
          </AlertDescription>
        </Alert>
      )}

      {generationStatus === 'success' && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-600">
            <strong>Carteiras geradas com sucesso!</strong> Suas carteiras Web3 estão prontas para uso.
          </AlertDescription>
        </Alert>
      )}

      {generationStatus === 'error' && generationErrors.length > 0 && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-600">
            <strong>Erro na geração de carteiras:</strong>
            <ul className="mt-2 list-disc list-inside">
              {generationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <Button
              onClick={onRetryGeneration}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {(pendingWalletsCount > 0 || generationStatus === 'generating') && (
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-600">
            <strong>Processando carteiras...</strong> {generationStatus === 'generating' ? 
              'Gerando endereços via Tatum API.' : 
              'Algumas carteiras ainda estão sendo processadas via Tatum API.'
            } A página será atualizada automaticamente.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
