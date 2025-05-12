
import React from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import WalletCard from './WalletCard';
import WalletsSkeleton from './WalletsSkeleton';
import EmptyWalletState from './EmptyWalletState';
import NoSearchResults from './NoSearchResults';

interface WalletListContainerProps {
  isLoading: boolean;
  carteiras: CarteiraBTC[];
  filteredWallets: CarteiraBTC[];
  searchQuery: string;
  onAddWallet: () => void;
  onClearSearch: () => void;
}

const WalletListContainer: React.FC<WalletListContainerProps> = ({
  isLoading,
  carteiras,
  filteredWallets,
  searchQuery,
  onAddWallet,
  onClearSearch
}) => {
  if (isLoading) {
    return <WalletsSkeleton />;
  }
  
  if (carteiras.length === 0) {
    return <EmptyWalletState onAddWallet={onAddWallet} />;
  }
  
  if (filteredWallets.length === 0 && searchQuery) {
    return <NoSearchResults onClearSearch={onClearSearch} />;
  }
  
  return (
    <div className="space-y-4">
      {filteredWallets.map(carteira => (
        <WalletCard key={carteira.id} carteira={carteira} />
      ))}
    </div>
  );
};

export default WalletListContainer;
