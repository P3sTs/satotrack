
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Unlock, Gift, TrendingUp, Clock } from 'lucide-react';
import { StakingPosition, StakingProtocol } from '@/types/staking';

interface StakingPositionCardProps {
  position: StakingPosition;
  protocol: StakingProtocol;
  onUnstake: (positionId: string, amount: string) => void;
  onClaimRewards: (positionId: string) => void;
  isLoading?: boolean;
}

export const StakingPositionCard: React.FC<StakingPositionCardProps> = ({
  position,
  protocol,
  onUnstake,
  onClaimRewards,
  isLoading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'unstaking': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const canClaim = parseFloat(position.rewardsEarned) > 0;
  const canUnstake = position.status === 'active';

  return (
    <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-satotrack-text">
            {protocol.name}
          </CardTitle>
          <Badge className={`text-xs ${getStatusColor(position.status)}`}>
            {position.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Valor em Staking</p>
            <p className="text-lg font-bold text-satotrack-text">
              {parseFloat(position.stakedAmount).toFixed(4)} {protocol.token}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Recompensas</p>
            <p className="text-lg font-bold text-satotrack-neon">
              {parseFloat(position.rewardsEarned).toFixed(6)} {protocol.token}
            </p>
          </div>
        </div>

        {/* Performance */}
        <div className="p-3 bg-satotrack-neon/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-satotrack-neon" />
              <span className="text-sm font-medium">Rendimento APY</span>
            </div>
            <span className="font-bold text-satotrack-neon">
              {protocol.apy.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            Iniciado em {new Date(position.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onClaimRewards(position.id)}
            disabled={isLoading || !canClaim}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Gift className="h-4 w-4 mr-2" />
            Resgatar ({parseFloat(position.rewardsEarned).toFixed(4)})
          </Button>
          <Button
            onClick={() => onUnstake(position.id, position.stakedAmount)}
            disabled={isLoading || !canUnstake}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Unlock className="h-4 w-4 mr-2" />
            Unstake
          </Button>
        </div>

        {/* Wallet Address */}
        <div className="text-xs text-muted-foreground">
          Carteira: {position.walletAddress.slice(0, 6)}...{position.walletAddress.slice(-4)}
        </div>
      </CardContent>
    </Card>
  );
};
