
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyWalletStateProps {
  onAddWallet?: () => void;
}

const EmptyWalletState: React.FC<EmptyWalletStateProps> = ({ onAddWallet }) => {
  return (
    <div className="text-center p-8 border border-dashed border-border rounded-lg">
      <svg 
        className="h-16 w-16 mx-auto mb-4 text-muted-foreground" 
        fill="none"
        height="24"
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        viewBox="0 0 24 24" 
        width="24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2v20"/>
        <path d="M2 12h20"/>
        <path d="m4.93 4.93 14.14 14.14"/>
        <path d="m19.07 4.93-14.14 14.14"/>
      </svg>
      
      <h3 className="text-xl font-medium mb-2">Nenhuma transação encontrada</h3>
      <p className="text-muted-foreground mb-6">Esta carteira ainda não tem transações registradas.</p>
      
      {onAddWallet && (
        <Button 
          onClick={onAddWallet}
          className="inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Nova Carteira
        </Button>
      )}
    </div>
  );
};

export default EmptyWalletState;
