import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Loader2, X } from 'lucide-react';
import { NETWORK_CATEGORIES } from '@/hooks/useMultiChainWallets';

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWallet: (networks: string[]) => void;
  existingWallets: string[];
  isGenerating: boolean;
}

export const AddWalletModal: React.FC<AddWalletModalProps> = ({
  isOpen,
  onClose,
  onAddWallet,
  existingWallets,
  isGenerating
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);

  // Get all available networks
  const allNetworks = Object.values(NETWORK_CATEGORIES).flatMap(category => category.networks);
  const availableNetworks = allNetworks.filter(network => !existingWallets.includes(network));

  // Filter networks based on search
  const filteredNetworks = availableNetworks.filter(network =>
    network.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNetworkIcon = (network: string) => {
    const icons = {
      BTC: '₿', ETH: 'Ξ', MATIC: '⬟', USDT: '₮', SOL: '◎',
      AVAX: '🔺', BSC: '💎', ARBITRUM: '🔷', OP: '🔴', BASE: '🔵',
      XRP: '💧', ADA: '💫', DOT: '⚫', ATOM: '⚛️', NEAR: '🌊',
      ALGO: '△', AURORA: '🌅', CELO: '💛', FTM: '👻', FLOW: '🌊'
    };
    return icons[network as keyof typeof icons] || '●';
  };

  const getNetworkName = (network: string) => {
    const names = {
      BTC: 'Bitcoin', ETH: 'Ethereum', MATIC: 'Polygon', USDT: 'Tether',
      SOL: 'Solana', AVAX: 'Avalanche', BSC: 'BNB Smart Chain',
      ARBITRUM: 'Arbitrum One', OP: 'Optimism', BASE: 'Base',
      XRP: 'Ripple', ADA: 'Cardano', DOT: 'Polkadot', ATOM: 'Cosmos',
      NEAR: 'NEAR Protocol', ALGO: 'Algorand', AURORA: 'Aurora',
      CELO: 'Celo', FTM: 'Fantom', FLOW: 'Flow'
    };
    return names[network as keyof typeof names] || network;
  };

  const handleNetworkToggle = (network: string) => {
    setSelectedNetworks(prev =>
      prev.includes(network)
        ? prev.filter(n => n !== network)
        : [...prev, network]
    );
  };

  const handleAddSelected = () => {
    if (selectedNetworks.length === 0) return;
    onAddWallet(selectedNetworks);
    setSelectedNetworks([]);
    setSearchTerm('');
  };

  const handleClose = () => {
    setSelectedNetworks([]);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-dashboard-dark border-dashboard-light">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-satotrack-neon" />
            Adicionar Nova Rede
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar rede blockchain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-dashboard-medium border-dashboard-light"
            />
          </div>

          {/* Selected Networks */}
          {selectedNetworks.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Redes selecionadas:</p>
              <div className="flex flex-wrap gap-2">
                {selectedNetworks.map((network) => (
                  <Badge
                    key={network}
                    variant="outline"
                    className="border-satotrack-neon/30 text-satotrack-neon flex items-center gap-1"
                  >
                    <span>{getNetworkIcon(network)}</span>
                    {network}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNetworkToggle(network)}
                      className="h-4 w-4 p-0 ml-1 hover:bg-red-500/20"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Networks */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <p className="text-sm text-muted-foreground">
              Redes disponíveis ({filteredNetworks.length}):
            </p>
            
            {filteredNetworks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma rede encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredNetworks.map((network) => (
                  <div
                    key={network}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-dashboard-medium/50 hover:bg-dashboard-medium transition-colors"
                  >
                    <Checkbox
                      id={network}
                      checked={selectedNetworks.includes(network)}
                      onCheckedChange={() => handleNetworkToggle(network)}
                      className="border-dashboard-light"
                    />
                    <label
                      htmlFor={network}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <span className="text-lg">{getNetworkIcon(network)}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{network}</p>
                        <p className="text-xs text-muted-foreground">{getNetworkName(network)}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isGenerating}
              className="border-dashboard-light text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddSelected}
              disabled={selectedNetworks.length === 0 || isGenerating}
              className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar {selectedNetworks.length} rede{selectedNetworks.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};