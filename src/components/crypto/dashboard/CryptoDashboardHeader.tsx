
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Plus, Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react';

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

interface CryptoDashboardHeaderProps {
  generationStatus: GenerationStatus;
  onGoBack: () => void;
  onRefreshAll: () => void;
  onGenerateWallets: () => void;
  isLoading: boolean;
  activeWalletsCount: number;
  shouldShowGenerateButton: boolean;
}

const getGenerationStatusIcon = (status: GenerationStatus) => {
  switch (status) {
    case 'generating':
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Zap className="h-5 w-5 text-satotrack-neon" />;
  }
};

export const CryptoDashboardHeader: React.FC<CryptoDashboardHeaderProps> = ({
  generationStatus,
  onGoBack,
  onRefreshAll,
  onGenerateWallets,
  isLoading,
  activeWalletsCount,
  shouldShowGenerateButton
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={onGoBack}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-satotrack-text mb-2 flex items-center gap-2">
            {getGenerationStatusIcon(generationStatus)}
            Carteiras Cripto
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas carteiras de criptomoedas com segurança total
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={onRefreshAll}
          variant="outline"
          disabled={isLoading || activeWalletsCount === 0}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Tudo
        </Button>
        
        {shouldShowGenerateButton && (
          <Button
            onClick={onGenerateWallets}
            disabled={generationStatus === 'generating'}
            className="gap-2 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            {generationStatus === 'generating' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {generationStatus === 'generating' ? 'Gerando...' : 'Gerar Carteiras'}
          </Button>
        )}
      </div>
    </div>
  );
};
