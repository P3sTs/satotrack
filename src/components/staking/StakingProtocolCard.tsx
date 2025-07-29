
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Lock, Coins, ExternalLink } from 'lucide-react';
import { StakingProtocol } from '@/types/staking';
import { toast } from 'sonner';

interface StakingProtocolCardProps {
  protocol: StakingProtocol;
  onStake: (protocolId: string, amount: string, walletAddress: string) => void;
  isLoading?: boolean;
  userWalletAddress?: string;
}

export const StakingProtocolCard: React.FC<StakingProtocolCardProps> = ({
  protocol,
  onStake,
  isLoading = false,
  userWalletAddress
}) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [showStakeInput, setShowStakeInput] = useState(false);

  const handleStake = () => {
    if (!userWalletAddress) {
      toast.error('Conecte sua carteira primeiro');
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) < parseFloat(protocol.minAmount)) {
      toast.error(`Valor mínimo: ${protocol.minAmount} ${protocol.token}`);
      return;
    }

    onStake(protocol.id, stakeAmount, userWalletAddress);
    setStakeAmount('');
    setShowStakeInput(false);
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'ethereum': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'polygon': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Card className="bg-dashboard-dark/80 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-satotrack-text flex items-center gap-2">
            <Coins className="h-5 w-5 text-satotrack-neon" />
            {protocol.name}
          </CardTitle>
          <Badge className={`text-xs ${getNetworkColor(protocol.network)}`}>
            {protocol.network.charAt(0).toUpperCase() + protocol.network.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* APY Display */}
        <div className="flex items-center justify-between p-3 bg-satotrack-neon/10 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-satotrack-neon" />
            <span className="text-sm font-medium">APY</span>
          </div>
          <span className="text-xl font-bold text-satotrack-neon">
            {protocol.apy.toFixed(1)}%
          </span>
        </div>

        {/* Protocol Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Token:</span>
            <span className="font-medium text-satotrack-text">{protocol.token}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mín. Stake:</span>
            <span className="font-medium text-satotrack-text">
              {protocol.minAmount} {protocol.token}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Contrato:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs text-satotrack-text">
                {protocol.contractAddress.slice(0, 6)}...{protocol.contractAddress.slice(-4)}
              </span>
              <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Stake Input */}
        {showStakeInput && (
          <div className="space-y-3 p-3 bg-dashboard-medium/30 rounded-lg">
            <Input
              type="number"
              placeholder={`Valor em ${protocol.token}`}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="bg-dashboard-dark border-satotrack-neon/30"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleStake}
                disabled={isLoading || !stakeAmount}
                className="flex-1 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
                size="sm"
              >
                <Lock className="h-4 w-4 mr-2" />
                Confirmar Stake
              </Button>
              <Button
                onClick={() => setShowStakeInput(false)}
                variant="outline"
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showStakeInput && (
          <Button
            onClick={() => setShowStakeInput(true)}
            disabled={isLoading || !protocol.isActive}
            className="w-full bg-gradient-to-r from-satotrack-neon to-emerald-400 hover:from-satotrack-neon/90 hover:to-emerald-400/90 text-black font-semibold"
          >
            <Lock className="h-4 w-4 mr-2" />
            Fazer Staking
          </Button>
        )}

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${protocol.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-muted-foreground">
            {protocol.isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
