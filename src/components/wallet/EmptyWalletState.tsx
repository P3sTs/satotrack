
import React from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyWalletStateProps {
  onAddWallet: () => void;
}

const EmptyWalletState: React.FC<EmptyWalletStateProps> = ({ onAddWallet }) => {
  return (
    <div className="text-center p-12 border border-dashed border-border rounded-lg">
      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-medium mb-2">Nenhuma carteira encontrada</h3>
      <p className="text-muted-foreground mb-6">Adicione uma carteira Bitcoin para começar a monitorá-la</p>
      <Button 
        onClick={onAddWallet}
        variant="bitcoin"
        size="lg"
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar Carteira
      </Button>
    </div>
  );
};

export default EmptyWalletState;
