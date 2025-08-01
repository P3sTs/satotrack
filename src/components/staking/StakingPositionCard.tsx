
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Unlock, Gift, TrendingUp, Clock, Coins } from 'lucide-react';
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
      case 'completed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ATIVO';
      case 'pending': return 'PENDENTE';
      case 'unstaking': return 'UNSTAKING';
      case 'completed': return 'FINALIZADO';
      default: return status.toUpperCase();
    }
  };

  const canClaim = parseFloat(position.rewards_earned) > 0 && position.status === 'active';
  const canUnstake = position.status === 'active';
  
  const stakedAmount = parseFloat(position.staked_amount);
  const rewardsAmount = parseFloat(position.rewards_earned);
  const totalValue = stakedAmount + rewardsAmount;
  
  const rewardsPercentage = stakedAmount > 0 ? (rewardsAmount / stakedAmount) * 100 : 0;
  
  // Calculate estimated days since staking
  const daysSinceStaking = Math.floor((Date.now() - new Date(position.created_at).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="bg-dashboard-dark/90 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-satotrack-text flex items-center gap-2">
            <Coins className="h-5 w-5 text-satotrack-neon" />
            {protocol.name}
          </CardTitle>
          <Badge className={`text-xs ${getStatusColor(position.status)}`}>
            {getStatusText(position.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Valor Staked</p>
            <p className="text-xl font-bold text-satotrack-text">
              {stakedAmount.toFixed(4)}
            </p>
            <p className="text-xs text-muted-foreground">{protocol.token}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Recompensas</p>
            <p className="text-xl font-bold text-satotrack-neon">
              {rewardsAmount.toFixed(6)}
            </p>
            <p className="text-xs text-satotrack-neon">
              +{rewardsPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Total Value */}
        <div className="p-3 bg-satotrack-neon/10 rounded-lg border border-satotrack-neon/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-satotrack-text">Valor Total</span>
            <span className="text-lg font-bold text-satotrack-neon">
              {totalValue.toFixed(4)} {protocol.token}
            </span>
          </div>
          <Progress 
            value={Math.min(rewardsPercentage * 2, 100)} 
            className="h-2"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <div>
              <div className="text-green-400 font-semibold">
                {protocol.apy.toFixed(1)}% APY
              </div>
              <div className="text-xs text-muted-foreground">Taxa anual</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <div>
              <div className="text-blue-400 font-semibold">
                {daysSinceStaking}d
              </div>
              <div className="text-xs text-muted-foreground">Tempo ativo</div>
            </div>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="p-2 bg-dashboard-medium/30 rounded text-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-muted-foreground">TX Hash:</span>
            <span className="font-mono text-satotrack-text">
              {position.transaction_hash.slice(0, 6)}...{position.transaction_hash.slice(-6)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Carteira:</span>
            <span className="font-mono text-satotrack-text">
              {position.wallet_address.slice(0, 6)}...{position.wallet_address.slice(-4)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onClaimRewards(position.id)}
            disabled={isLoading || !canClaim}
            variant="outline"
            size="sm"
            className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            <Gift className="h-4 w-4 mr-1" />
            Claim
            {canClaim && (
              <span className="ml-1 text-xs">
                ({rewardsAmount.toFixed(4)})
              </span>
            )}
          </Button>
          <Button
            onClick={() => onUnstake(position.id, position.staked_amount)}
            disabled={isLoading || !canUnstake}
            variant="outline" 
            size="sm"
            className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
          >
            <Unlock className="h-4 w-4 mr-1" />
            Unstake
          </Button>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-dashboard-medium/30">
          <Clock className="h-3 w-3" />
          <span>
            Iniciado em {new Date(position.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
