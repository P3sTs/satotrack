
import React, { useState } from 'react';
import { useMultiChainWallets } from '../hooks/useMultiChainWallets';
import { SatoTrackerWalletHeader } from '@/components/crypto/redesign/SatoTrackerWalletHeader';
import { SatoTrackerWalletList } from '@/components/crypto/redesign/SatoTrackerWalletList';
import { AddWalletModal } from '@/components/crypto/redesign/AddWalletModal';
import { WalletStatusSection } from '@/components/crypto/redesign/WalletStatusSection';

const Crypto = () => {
  const {
    wallets,
    isLoading,
    generationStatus,
    hasGeneratedWallets,
    generateWallets,
    refreshAllBalances
  } = useMultiChainWallets();

  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'BRL' | 'BTC'>('BRL');
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);

  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const isGenerating = generationStatus === 'generating';

  // Show only main wallets by default: BTC, ETH, MATIC, USDT
  const mainWallets = activeWallets.filter(w => 
    ['BTC', 'ETH', 'MATIC', 'USDT'].includes(w.currency)
  );
  const otherWallets = activeWallets.filter(w => 
    !['BTC', 'ETH', 'MATIC', 'USDT'].includes(w.currency)
  );

  const displayWallets = hasGeneratedWallets ? [...mainWallets, ...otherWallets] : [];

  const handleGenerateMainWallets = async () => {
    await generateWallets(['BTC', 'ETH', 'MATIC', 'USDT'], false);
  };

  const handleAddWallet = async (networks: string[]) => {
    await generateWallets(networks, false);
    setShowAddWalletModal(false);
  };

  // Calculate total balance in selected currency
  const totalBalance = displayWallets.reduce((sum, wallet) => 
    sum + parseFloat(wallet.balance || '0'), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header with Currency Selector and Total Balance */}
        <SatoTrackerWalletHeader
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          totalBalance={totalBalance}
          walletsCount={displayWallets.length}
        />

        {/* Wallet List */}
        <SatoTrackerWalletList
          wallets={displayWallets}
          selectedCurrency={selectedCurrency}
          isLoading={isLoading}
          hasGeneratedWallets={hasGeneratedWallets}
          isGenerating={isGenerating}
          onGenerateMainWallets={handleGenerateMainWallets}
          onAddWallet={() => setShowAddWalletModal(true)}
          onRefreshWallet={refreshAllBalances}
        />

        {/* Status Section */}
        <WalletStatusSection
          walletsCount={displayWallets.length}
          isGenerating={isGenerating}
        />

        {/* Add Wallet Modal */}
        <AddWalletModal
          isOpen={showAddWalletModal}
          onClose={() => setShowAddWalletModal(false)}
          onAddWallet={handleAddWallet}
          existingWallets={wallets.map(w => w.currency)}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default Crypto;
