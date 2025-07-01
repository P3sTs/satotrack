
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Plus, Loader2 } from 'lucide-react';

interface CryptoDashboardHeaderProps {
  isGenerating: boolean;
  onGoBack: () => void;
  onRefreshAll: () => void;
  onGenerateWallets: () => void;
  isLoading: boolean;
  activeWalletsCount: number;
  shouldShowGenerateButton: boolean;
}

export const CryptoDashboardHeader: React.FC<CryptoDashboardHeaderProps> = ({
  isGenerating,
  onGoBack,
  onRefreshAll,
  onGenerateWallets,
  isLoading,
  activeWalletsCount,
  shouldShowGenerateButton
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-dashboard-medium">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoBack}
          className="text-satotrack-text hover:text-white hover:bg-dashboard-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-satotrack-text">
            Carteiras Cripto
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            🔒 Sistema Tatum KMS - Segurança Máxima
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {activeWalletsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshAll}
            disabled={isLoading}
            className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10 flex-1 sm:flex-none"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Atualizar
          </Button>
        )}

        {shouldShowGenerateButton && (
          <Button
            onClick={onGenerateWallets}
            disabled={isGenerating}
            className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90 flex-1 sm:flex-none"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Gerando...' : 'Gerar Carteiras'}
          </Button>
        )}
      </div>
    </div>
  );
};
