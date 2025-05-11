
import React, { useState } from 'react';
import { useCarteiras } from '../contexts/CarteirasContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NewWalletModal from '../components/NewWalletModal';
import WalletCard from '../components/wallet/WalletCard';
import EmptyWalletState from '../components/wallet/EmptyWalletState';
import WalletsSkeleton from '../components/wallet/WalletsSkeleton';

const WalletsManager: React.FC = () => {
  const { carteiras, isLoading } = useCarteiras();
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Carteiras</h1>
          <p className="text-muted-foreground">Gerencie suas carteiras Bitcoin em um só lugar</p>
        </div>
        <Button 
          onClick={() => setIsNewWalletModalOpen(true)}
          variant="bitcoin"
          size="lg"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Carteira
        </Button>
      </div>

      {isLoading ? (
        <WalletsSkeleton />
      ) : carteiras.length === 0 ? (
        <EmptyWalletState onAddWallet={() => setIsNewWalletModalOpen(true)} />
      ) : (
        <div className="space-y-4">
          {carteiras.map(carteira => (
            <WalletCard key={carteira.id} carteira={carteira} />
          ))}
        </div>
      )}

      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />
    </div>
  );
};

export default WalletsManager;
