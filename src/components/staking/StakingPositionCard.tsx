
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, TrendingUp, ArrowUpRight, Gift, Clock } from 'lucide-react';
import { StakingPosition, StakingProtocol } from '@/types/staking';

interface StakingPositionCardProps {
  position: StakingPosition;
  protocol: StakingProtocol;
  onUnstake: (positionId: string, amount: string) => Promise<void>;
  onClaimRewards: (positionId: string) => Promise<void>;
  isLoading: boolean;
}

export const StakingPositionCard: React.FC<StakingPositionCardProps> = ({
  position,
  protocol,
  onUnstake,
  onClaimRewards,
  isLoading
}) => {
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [showUnstakeInput, setShowUnstakeInput] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'unstaking': return 'bg-orange-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'unstaking': return 'Fazendo Unstake';
      case 'completed': return 'Completo';
      default: return status;
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
    
    try {
      await onUnstake(position.id, unstakeAmount);
      setUnstakeAmount('');
      setShowUnstakeInput(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleClaimRewards = async () => {
    try {
      await onClaimRewards(position.id);
    } catch (error) {
      // Error handled in hook
    }
  };

  const progressPercentage = Math.min((position.rewards_earned / position.staked_amount) * 100, 100);

  return (
    <Card className="bg-dashboard-dark/80 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-satotrack-text flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {protocol.name}
          </CardTitle>
          <Badge className={`${getStatusColor(position.status)} text-white text-xs px-2 py-1`}>
            {getStatusText(position.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Staking Amount */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Valor em Stake</span>
          <span className="font-semibold text-satotrack-text">
            {position.staked_amount.toFixed(6)} {protocol.token}
          </span>
        </div>

        {/* Rewards */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Recompensas</span>
          <span className="font-semibold text-green-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {position.rewards_earned.toFixed(6)} {protocol.token}
          </span>
        </div>

        {/* APY */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">APY</span>
          <span className="font-semibold text-blue-400">
            {protocol.apy}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso de Recompensas</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {position.status === 'active' && (
            <>
              {!showUnstakeInput ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUnstakeInput(true)}
                  className="flex-1 text-orange-400 border-orange-400 hover:bg-orange-400/10"
                  disabled={isLoading}
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Unstake
                </Button>
              ) : (
                <div className="flex gap-1 flex-1">
                  <Input
                    type="number"
                    placeholder="Valor"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="h-8 text-xs"
                    max={position.staked_amount}
                    step="0.000001"
                  />
                  <Button
                    size="sm"
                    onClick={handleUnstake}
                    disabled={isLoading || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
                    className="h-8 px-2 bg-orange-500 hover:bg-orange-600"
                  >
                    OK
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowUnstakeInput(false);
                      setUnstakeAmount('');
                    }}
                    className="h-8 px-2"
                  >
                    ✕
                  </Button>
                </div>
              )}

              {position.rewards_earned > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClaimRewards}
                  className="flex-1 text-green-400 border-green-400 hover:bg-green-400/10"
                  disabled={isLoading}
                >
                  <Gift className="h-3 w-3 mr-1" />
                  Claim
                </Button>
              )}
            </>
          )}

          {position.status === 'pending' && (
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Aguardando confirmação...
            </div>
          )}

          {position.status === 'unstaking' && (
            <div className="flex-1 flex items-center justify-center text-xs text-orange-400">
              <Clock className="h-3 w-3 mr-1" />
              Processando unstake...
            </div>
          )}
        </div>

        {/* Transaction Hash */}
        <div className="text-xs text-muted-foreground truncate">
          <span className="font-medium">Hash: </span>
          <span className="font-mono">{position.transaction_hash}</span>
        </div>
      </CardContent>
    </Card>
  );
};
