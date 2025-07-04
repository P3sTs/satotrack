import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Sparkles } from 'lucide-react';
import { MultiChainWallet } from '@/hooks/useMultiChainWallets';
import { PremiumWalletCard } from './PremiumWalletCard';
import { EmptyWalletState } from './EmptyWalletState';

interface SatoTrackerWalletListProps {
  wallets: MultiChainWallet[];
  selectedCurrency: 'USD' | 'BRL' | 'BTC';
  isLoading: boolean;
  hasGeneratedWallets: boolean;
  isGenerating: boolean;
  onGenerateMainWallets: () => void;
  onAddWallet: () => void;
  onRefreshWallet: () => void;
}

export const SatoTrackerWalletList: React.FC<SatoTrackerWalletListProps> = ({
  wallets,
  selectedCurrency,
  isLoading,
  hasGeneratedWallets,
  isGenerating,
  onGenerateMainWallets,
  onAddWallet,
  onRefreshWallet
}) => {
  if (!hasGeneratedWallets) {
    return (
      <EmptyWalletState
        isGenerating={isGenerating}
        onGenerateMainWallets={onGenerateMainWallets}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <PremiumWalletCard
            key={wallet.id}
            wallet={wallet}
            selectedCurrency={selectedCurrency}
            onRefresh={onRefreshWallet}
          />
        ))}
      </div>

      {/* Add More Networks Button */}
      <div className="flex justify-center">
        <Button
          onClick={onAddWallet}
          disabled={isGenerating}
          className="bg-gradient-to-r from-satotrack-neon to-emerald-400 hover:from-satotrack-neon/90 hover:to-emerald-400/90 text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isGenerating ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Plus className="h-5 w-5 mr-2" />
          )}
          Adicionar outra rede
        </Button>
      </div>

      {/* Premium Notice */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-purple-300">
            Segurança real com liberdade cripto
          </span>
        </div>
      </div>
    </div>
  );
};