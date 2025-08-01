
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Zap, Info } from 'lucide-react';
import { StakingProtocol } from '@/types/staking';

interface StakingProtocolCardProps {
  protocol: StakingProtocol;
  onStake: (protocolId: string, amount: string, walletAddress: string) => Promise<void>;
  isLoading: boolean;
  userWalletAddress?: string;
}

export const StakingProtocolCard: React.FC<StakingProtocolCardProps> = ({
  protocol,
  onStake,
  isLoading,
  userWalletAddress
}) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [showStakeInput, setShowStakeInput] = useState(false);

  const handleStake = async () => {
    if (!stakeAmount || !userWalletAddress || parseFloat(stakeAmount) < protocol.min_amount) {
      return;
    }
    
    try {
      await onStake(protocol.id, stakeAmount, userWalletAddress);
      setStakeAmount('');
      setShowStakeInput(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case 'ethereum': return 'bg-blue-500';
      case 'polygon': return 'bg-purple-500';
      case 'binance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const isValidAmount = stakeAmount && parseFloat(stakeAmount) >= protocol.min_amount;

  return (
    <Card className="bg-dashboard-dark/80 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-satotrack-text">
            {protocol.name}
          </CardTitle>
          <Badge className={`${getNetworkColor(protocol.network)} text-white text-xs px-2 py-1`}>
            {protocol.network.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* APY Display */}
        <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-sm text-muted-foreground">APY Anual</span>
          </div>
          <span className="text-xl font-bold text-green-400">
            {protocol.apy}%
          </span>
        </div>

        {/* Protocol Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Token:</span>
            <p className="font-semibold text-satotrack-text">{protocol.token}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Mín. Stake:</span>
            <p className="font-semibold text-satotrack-text">
              {protocol.min_amount} {protocol.token}
            </p>
          </div>
        </div>

        {/* Platform Fee */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3" />
          <span>Taxa da plataforma: {protocol.platform_fee_percentage}%</span>
        </div>

        {/* Staking Section */}
        <div className="pt-2 border-t border-satotrack-neon/10">
          {!showStakeInput ? (
            <Button
              className="w-full bg-satotrack-neon hover:bg-satotrack-neon/80 text-dashboard-dark font-semibold"
              onClick={() => setShowStakeInput(true)}
              disabled={!userWalletAddress || isLoading}
            >
              <Shield className="h-4 w-4 mr-2" />
              {userWalletAddress ? 'Fazer Staking' : 'Conecte sua Carteira'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <Input
                  type="number"
                  placeholder={`Mínimo: ${protocol.min_amount} ${protocol.token}`}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-dashboard-medium border-satotrack-neon/20 text-satotrack-text"
                  min={protocol.min_amount}
                  step="0.000001"
                />
                {stakeAmount && !isValidAmount && (
                  <p className="text-red-400 text-xs mt-1">
                    Valor mínimo: {protocol.min_amount} {protocol.token}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-satotrack-neon hover:bg-satotrack-neon/80 text-dashboard-dark"
                  onClick={handleStake}
                  disabled={isLoading || !isValidAmount}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Confirmar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStakeInput(false);
                    setStakeAmount('');
                  }}
                  className="px-3 border-satotrack-neon/20 text-satotrack-text hover:bg-satotrack-neon/10"
                >
                  ✕
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 pt-2">
          <Shield className="h-4 w-4 text-blue-400" />
          <span className="text-xs text-blue-400">Protocolo Auditado e Seguro</span>
        </div>
      </CardContent>
    </Card>
  );
};
