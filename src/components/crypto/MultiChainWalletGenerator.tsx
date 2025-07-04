import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Wallet, 
  Plus, 
  Loader2, 
  Globe, 
  Shield,
  Zap,
  Star,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { NETWORK_CATEGORIES } from '@/hooks/useMultiChainWallets';

interface MultiChainWalletGeneratorProps {
  onGenerate: (networks?: string[], generateAll?: boolean) => Promise<void>;
  isGenerating: boolean;
  hasWallets: boolean;
}

export const MultiChainWalletGenerator: React.FC<MultiChainWalletGeneratorProps> = ({
  onGenerate,
  isGenerating,
  hasWallets
}) => {
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(
    NETWORK_CATEGORIES.priority.networks
  );
  const [generateAll, setGenerateAll] = useState(false);

  const handleNetworkToggle = (network: string) => {
    setSelectedNetworks(prev => 
      prev.includes(network) 
        ? prev.filter(n => n !== network)
        : [...prev, network]
    );
  };

  const handleGenerateSelected = async () => {
    if (selectedNetworks.length === 0) {
      toast.error('Selecione pelo menos uma rede');
      return;
    }
    await onGenerate(selectedNetworks, false);
  };

  const handleGenerateAll = async () => {
    await onGenerate(undefined, true);
  };

  const getNetworkIcon = (network: string) => {
    const icons = {
      BTC: '₿', ETH: 'Ξ', MATIC: '⬟', USDT: '₮', SOL: '◎',
      AVAX: '🔺', BSC: '💎', ARBITRUM: '🔷', OP: '🔴', BASE: '🔵',
      XRP: '💧', ADA: '💫', DOT: '⚫', ATOM: '⚛️', NEAR: '🌊'
    };
    return icons[network as keyof typeof icons] || '●';
  };

  if (hasWallets) {
    return (
      <Card className="bg-emerald-500/10 border-emerald-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            <div>
              <h3 className="text-lg font-semibold text-emerald-400">
                Sistema Multi-Chain Ativo
              </h3>
              <p className="text-sm text-emerald-500">
                Suas carteiras estão prontas para uso
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleGenerateSelected}
              disabled={isGenerating}
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Redes
            </Button>
            
            <Button
              onClick={handleGenerateAll}
              disabled={isGenerating}
              variant="outline" 
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Globe className="h-4 w-4 mr-2" />
              Gerar Todas
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-dashboard-dark border-satotrack-neon/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-satotrack-text">
          <Wallet className="h-6 w-6 text-satotrack-neon" />
          Gerador Multi-Chain
          <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon">
            50+ Redes
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onGenerate(NETWORK_CATEGORIES.priority.networks, false)}
            disabled={isGenerating}
            className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Star className="h-4 w-4 mr-2" />
            )}
            Gerar Principais
          </Button>
          
          <Button
            onClick={handleGenerateAll}
            disabled={isGenerating}
            variant="outline"
            className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Globe className="h-4 w-4 mr-2" />
            )}
            Todas as Redes
          </Button>
        </div>

        {/* Network Categories */}
        <div className="space-y-4">
          {Object.entries(NETWORK_CATEGORIES).map(([key, category]) => (
            <div key={key} className="space-y-2">
              <h4 className="text-sm font-medium text-satotrack-text flex items-center gap-2">
                {key === 'priority' && <Star className="h-4 w-4 text-yellow-500" />}
                {key === 'layer2' && <Zap className="h-4 w-4 text-blue-500" />}
                {key === 'defi' && <Shield className="h-4 w-4 text-green-500" />}
                {key === 'enterprise' && <Globe className="h-4 w-4 text-purple-500" />}
                {key === 'alternative' && <CheckCircle className="h-4 w-4 text-orange-500" />}
                {category.name}
              </h4>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {category.networks.map((network) => (
                  <div key={network} className="flex items-center space-x-2">
                    <Checkbox
                      id={network}
                      checked={selectedNetworks.includes(network)}
                      onCheckedChange={() => handleNetworkToggle(network)}
                      className="border-satotrack-neon/30"
                    />
                    <label
                      htmlFor={network}
                      className="text-xs cursor-pointer flex items-center gap-1 text-satotrack-text"
                    >
                      <span>{getNetworkIcon(network)}</span>
                      {network}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Generation */}
        {selectedNetworks.length > 0 && (
          <div className="border-t border-dashboard-medium pt-4">
            <Button
              onClick={handleGenerateSelected}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Gerar {selectedNetworks.length} Rede(s) Selecionada(s)
            </Button>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-xs text-emerald-400 text-center">
            🔒 <strong>100% Seguro:</strong> Apenas dados públicos são armazenados. 
            Chaves privadas são gerenciadas pelo Tatum KMS.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};