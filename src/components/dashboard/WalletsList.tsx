
import React from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import CarteiraCard from '../CarteiraCard';
import { Button } from '@/components/ui/button';
import { Bitcoin, Lock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WalletsListProps {
  carteiras: CarteiraBTC[];
  isLoading: boolean;
  primaryWallet: CarteiraBTC | null;
  reachedLimit: boolean;
  onNewWallet: () => void;
}

const WalletsList: React.FC<WalletsListProps> = ({
  carteiras,
  isLoading,
  primaryWallet,
  reachedLimit,
  onNewWallet
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-medium mb-3 md:mb-4">
        {primaryWallet ? 'Carteiras Monitoradas' : 'Todas as Carteiras'}
      </h2>
    
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bitcoin-card animate-pulse p-4 md:p-6">
              <div className="h-5 md:h-6 bg-muted rounded w-1/3 mb-3 md:mb-4"></div>
              <div className="h-3 md:h-4 bg-muted rounded w-full mb-4 md:mb-6"></div>
              <div className="flex justify-between">
                <div className="h-6 md:h-8 bg-muted rounded w-1/3"></div>
                <div className="h-5 md:h-6 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : carteiras.length === 0 ? (
        <EmptyWalletsState onNewWallet={onNewWallet} reachedLimit={reachedLimit} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {carteiras
            .filter(carteira => !primaryWallet || carteira.id !== primaryWallet.id)
            .map(carteira => (
              <CarteiraCard key={carteira.id} carteira={carteira} isPrimary={false} />
            ))
          }
        </div>
      )}
    </div>
  );
};

// Helper component for empty state
const EmptyWalletsState: React.FC<{ onNewWallet: () => void; reachedLimit: boolean }> = ({ 
  onNewWallet, 
  reachedLimit 
}) => {
  return (
    <div className="text-center p-6 md:p-12 border border-dashed border-border rounded-lg">
      <Bitcoin className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-muted-foreground" />
      <h3 className="text-lg md:text-xl font-medium mb-2">Nenhuma carteira adicionada</h3>
      <p className="text-muted-foreground mb-4 md:mb-6">Adicione uma carteira Bitcoin para começar a monitorá-la</p>
      <Button 
        onClick={onNewWallet}
        className="inline-flex items-center gap-2 bg-bitcoin hover:bg-bitcoin-dark text-white transition-colors"
        disabled={reachedLimit}
      >
        {reachedLimit ? (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Limite atingido
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Adicionar Carteira
          </>
        )}
      </Button>
      {reachedLimit && (
        <div className="mt-4">
          <Link to="/planos">
            <Button variant="outline">
              Ver planos premium
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WalletsList;
