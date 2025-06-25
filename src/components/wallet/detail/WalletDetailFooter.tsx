
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const WalletDetailFooter: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mt-6">
      <AlertCircle className="h-6 w-6 text-yellow-500" />
      <div>
        <h3 className="font-medium text-yellow-500">Detecção automática</h3>
        <p className="text-sm text-muted-foreground">
          O SatoTrack monitora automaticamente esta carteira em busca de novas transações a cada hora.
        </p>
      </div>
    </div>
  );
};
