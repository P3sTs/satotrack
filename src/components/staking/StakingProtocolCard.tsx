
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Lock, Coins, ExternalLink, AlertCircle } from 'lucide-react';
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

    if (!stakeAmount || parseFloat(stakeAmount) < parseFloat(protocol.min_amount)) {
      toast.error(`Valor mínimo: ${protocol.min_amount} ${protocol.token}`);
      return;
    }

    onStake(protocol.id, stakeAmount, userWalletAddress);
    setStakeAmount('');
    setShowStakeInput(false);
  };

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case 'ethereum': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'polygon': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'binance': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatAPY = (apy: number) => {
    return apy.toFixed(1);
  };

  return (
    <Card className="bg-dashboard-dark/80 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all duration-300 hover:shadow-lg hover:shadow-satotrack-neon/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-satotrack-text flex items-center gap-2">
            <Coins className="h-5 w-5 text-satotrack-neon" />
            <div>
              <div>{protocol.name}</div>
              <div className="text-xs font-normal text-muted-foreground mt-1">
                {protocol.token} Staking
              </div>
            </div>
          </CardTitle>
          <Badge className={`text-xs ${getNetworkColor(protocol.network)}`}>
            {protocol.network.charAt(0).toUpperCase() + protocol.network.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* APY Highlight */}
        <div className="relative p-4 bg-gradient-to-r from-satotrack-neon/10 to-emerald-400/10 rounded-lg border border-satotrack-neon/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-satotrack-neon" />
              <span className="font-medium text-satotrack-text">APY</span>
            </div>
            <span className="text-2xl font-bold text-satotrack-neon">
              {formatAPY(protocol.apy)}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Taxa de rendimento anual
          </div>
        </div>

        {/* Protocol Details */}
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-muted-foreground">Token:</span>
              <div className="font-semibold text-satotrack-text">{protocol.token}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Min. Stake:</span>
              <div className="font-semibold text-satotrack-text">
                {protocol.min_amount} {protocol.token}
              </div>
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Taxa da Plataforma:</span>
            <div className="font-semibold text-satotrack-text">
              {protocol.platform_fee_percentage}%
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Contrato:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs text-satotrack-text">
                {protocol.contract_address.slice(0, 6)}...{protocol.contract_address.slice(-4)}
              </span>
              <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-satotrack-neon" />
            </div>
          </div>
        </div>

        {/* Stake Input */}
        {showStakeInput && (
          <div className="space-y-3 p-4 bg-dashboard-medium/30 rounded-lg border border-satotrack-neon/20">
            <Input
              type="number"
              placeholder={`Valor em ${protocol.token}`}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="bg-dashboard-dark border-satotrack-neon/30 focus:border-satotrack-neon"
              step="0.0001"
              min={protocol.min_amount}
            />
            
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <AlertCircle className="h-3 w-3" />
              <span>Taxa de gás estimada: ~0.003 ETH</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleStake}
                disabled={isLoading || !stakeAmount || parseFloat(stakeAmount) < parseFloat(protocol.min_amount)}
                className="flex-1 bg-satotrack-neon text-black hover:bg-satotrack-neon/90 font-semibold"
                size="sm"
              >
                <Lock className="h-4 w-4 mr-2" />
                Confirmar Stake
              </Button>
              <Button
                onClick={() => {
                  setShowStakeInput(false);
                  setStakeAmount('');
                }}
                variant="outline"
                size="sm"
                className="border-satotrack-neon/30 text-satotrack-text"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!showStakeInput && (
          <Button
            onClick={() => setShowStakeInput(true)}
            disabled={isLoading || !protocol.is_active || !userWalletAddress}
            className="w-full bg-gradient-to-r from-satotrack-neon to-emerald-400 hover:from-satotrack-neon/90 hover:to-emerald-400/90 text-black font-semibold transition-all duration-300"
          >
            <Lock className="h-4 w-4 mr-2" />
            {!userWalletAddress ? 'Conecte a Carteira' : 'Fazer Staking'}
          </Button>
        )}

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs pt-2">
          <div className={`w-2 h-2 rounded-full ${protocol.is_active ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
          <span className="text-muted-foreground">
            {protocol.is_active ? 'Protocolo Ativo' : 'Protocolo Inativo'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
