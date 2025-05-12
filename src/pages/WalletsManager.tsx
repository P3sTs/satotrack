
import React, { useState, useMemo } from 'react';
import { useCarteiras } from '../contexts/hooks/useCarteirasContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NewWalletModal from '../components/NewWalletModal';
import WalletCard from '../components/wallet/WalletCard';
import EmptyWalletState from '../components/wallet/EmptyWalletState';
import WalletsSkeleton from '../components/wallet/WalletsSkeleton';
import SearchWallets from '../components/wallet/SearchWallets';
import SortControls from '../components/SortControls';
import { SortOption } from '@/types/types';

const WalletsManager: React.FC = () => {
  const { carteiras, isLoading, ordenarCarteiras, sortOption, sortDirection } = useCarteiras();
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter wallets based on search query
  const filteredWallets = useMemo(() => {
    if (!searchQuery.trim()) {
      return carteiras;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return carteiras.filter(
      wallet => 
        wallet.nome.toLowerCase().includes(query) || 
        wallet.endereco.toLowerCase().includes(query)
    );
  }, [carteiras, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Gerenciamento de Carteiras</h1>
          <p className="text-sm text-muted-foreground">Gerencie suas carteiras Bitcoin em um só lugar</p>
        </div>
        <Button 
          onClick={() => setIsNewWalletModalOpen(true)}
          variant="bitcoin"
          size="lg"
          className="gap-2 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Nova Carteira
        </Button>
      </div>

      {!isLoading && carteiras.length > 0 && (
        <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
          <SearchWallets 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <p className="text-sm text-muted-foreground order-2 md:order-1">
              {filteredWallets.length} {filteredWallets.length === 1 ? 'carteira encontrada' : 'carteiras encontradas'}
            </p>
            <div className="order-1 md:order-2">
              <SortControls 
                sortOption={sortOption as SortOption}
                sortDirection={sortDirection}
                onSort={ordenarCarteiras}
              />
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <WalletsSkeleton />
      ) : carteiras.length === 0 ? (
        <EmptyWalletState onAddWallet={() => setIsNewWalletModalOpen(true)} />
      ) : filteredWallets.length === 0 ? (
        <div className="text-center p-6 md:p-12 border border-dashed border-border rounded-lg">
          <h3 className="text-lg md:text-xl font-medium mb-2">Nenhuma carteira encontrada</h3>
          <p className="text-muted-foreground mb-4 md:mb-6">Nenhuma carteira corresponde à sua pesquisa</p>
          <Button 
            variant="outline"
            onClick={() => setSearchQuery('')}
          >
            Limpar pesquisa
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWallets.map(carteira => (
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
