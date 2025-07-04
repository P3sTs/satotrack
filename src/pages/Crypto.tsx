
import React from 'react';
import { useMultiChainWallets } from '../hooks/useMultiChainWallets';
import { CryptoDashboardStats } from '@/components/crypto/dashboard/CryptoDashboardStats';
import { CryptoWalletsGrid } from '@/components/crypto/dashboard/CryptoWalletsGrid';
import { MultiChainWalletGenerator } from '@/components/crypto/MultiChainWalletGenerator';

const Crypto = () => {
  const {
    wallets,
    isLoading,
    generationStatus,
    hasGeneratedWallets,
    hasPendingWallets,
    generateWallets,
    refreshAllBalances
  } = useMultiChainWallets();

  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const pendingWallets = wallets.filter(w => w.address === 'pending_generation');
  const isGenerating = generationStatus === 'generating';

  const handleGenerateWallets = async (networks?: string[], generateAll = false) => {
    await generateWallets(networks, generateAll);
  };

  // Calcular estatísticas
  const totalBalance = activeWallets.reduce((sum, wallet) => 
    sum + parseFloat(wallet.balance || '0'), 0
  );

  const supportedCurrencies = new Set(activeWallets.map(w => w.currency)).size;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-satotrack-text mb-2">
          🔒 Crypto Seguro Multi-Chain
        </h1>
        <p className="text-muted-foreground">
          Sistema de carteiras seguras com Tatum KMS - Suporte a 50+ blockchains
        </p>
      </div>

      {/* Stats */}
      <CryptoDashboardStats
        activeWalletsCount={activeWallets.length}
        totalBalance={totalBalance}
        supportedCurrenciesCount={supportedCurrencies}
        isGenerating={isGenerating}
        pendingWalletsCount={pendingWallets.length}
      />

      {/* Wallet Generator */}
      {!hasGeneratedWallets && (
        <MultiChainWalletGenerator
          onGenerate={handleGenerateWallets}
          isGenerating={isGenerating}
          hasWallets={hasGeneratedWallets}
        />
      )}

      {/* Wallets Grid */}
      <CryptoWalletsGrid
        wallets={wallets}
        isGenerating={isGenerating}
        onGenerateWallets={() => handleGenerateWallets()}
      />
    </div>
  );
};

export default Crypto;
