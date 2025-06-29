
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Loader2, XCircle } from 'lucide-react';

interface CryptoDashboardAlertsProps {
  generationStatus: 'idle' | 'generating' | 'success' | 'error';
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
  if (generationStatus === 'generating') {
    return (
      <Alert className="border-blue-500/20 bg-blue-500/10">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <AlertDescription className="text-blue-600">
          <strong>Gerando carteiras seguras...</strong><br />
          🔒 Criando endereços criptográficos sem armazenar chaves privadas.
          Este processo pode levar alguns segundos.
        </AlertDescription>
      </Alert>
    );
  }

  if (generationStatus === 'error' && generationErrors.length > 0) {
    return (
      <Alert className="border-red-500/20 bg-red-500/10">
        <XCircle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-600">
          <strong>Erro na geração de carteiras:</strong><br />
          {generationErrors.map((error, index) => (
            <div key={index} className="mt-1">• {error}</div>
          ))}
          <Button
            onClick={onRetryGeneration}
            size="sm"
            className="mt-2 bg-red-500 hover:bg-red-600"
          >
            Tentar Novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (generationStatus === 'success') {
    return (
      <Alert className="border-green-500/20 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-600">
          <strong>✅ Carteiras geradas com sucesso!</strong><br />
          🔒 Todas as carteiras foram criadas seguindo os mais altos padrões de segurança.
          Suas chaves privadas NUNCA foram armazenadas neste sistema.
        </AlertDescription>
      </Alert>
    );
  }

  if (pendingWalletsCount > 0) {
    return (
      <Alert className="border-yellow-500/20 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-600">
          <strong>Processamento em andamento:</strong><br />
          🔒 {pendingWalletsCount} carteira(s) sendo processada(s) com segurança máxima.
          Aguarde a conclusão do processo.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
