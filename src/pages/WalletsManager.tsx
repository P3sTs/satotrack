
import React, { useState, useMemo } from 'react';
import { useCarteiras } from '../contexts/carteiras';
import { SortOption } from '@/types/types';
import NewWalletModal from '../components/NewWalletModal';
import WalletManagerHeader from '../components/wallet/WalletManagerHeader';
import SearchAndSortControls from '../components/wallet/SearchAndSortControls';
import WalletListContainer from '../components/wallet/WalletListContainer';

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

  const handleNewWallet = () => {
    setIsNewWalletModalOpen(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <WalletManagerHeader onNewWallet={handleNewWallet} />

      {!isLoading && carteiras.length > 0 && (
        <SearchAndSortControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOption={sortOption as SortOption}
          sortDirection={sortDirection}
          onSort={ordenarCarteiras}
          filteredCount={filteredWallets.length}
        />
      )}

      <WalletListContainer
        isLoading={isLoading}
        carteiras={carteiras}
        filteredWallets={filteredWallets}
        searchQuery={searchQuery}
        onAddWallet={handleNewWallet}
        onClearSearch={handleClearSearch}
      />

      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />
    </div>
  );
};

export default WalletsManager;
