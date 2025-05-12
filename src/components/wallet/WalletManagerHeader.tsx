
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface WalletManagerHeaderProps {
  onNewWallet: () => void;
}

const WalletManagerHeader: React.FC<WalletManagerHeaderProps> = ({ onNewWallet }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Gerenciamento de Carteiras</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas carteiras Bitcoin em um só lugar</p>
      </div>
      <Button 
        onClick={onNewWallet}
        variant="bitcoin"
        size="lg"
        className="gap-2 self-start md:self-auto"
      >
        <Plus className="h-4 w-4" />
        Nova Carteira
      </Button>
    </div>
  );
};

export default WalletManagerHeader;
